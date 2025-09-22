// meuHorarioAPI/src/services/geradorHorarioService.js

const prisma = require('../prisma');

const alocarHorariosParaDisciplina = async (disciplina, tx) => {
  const prismaClient = tx || prisma;
  const diasSemana = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"];
  const LIMITE_AULAS_SEGUIDAS = 3; // Nova regra de negócio

  // Busca todos os dados necessários no início
  const disponibilidadesDoProfessor = await prismaClient.disponibilidade.findMany({
    where: { professorId: disciplina.professorId },
  });
  const horariosJaOcupadosPeloProfessor = await prismaClient.horario.findMany({
    where: { disciplina: { professorId: disciplina.professorId } },
  });
  const horariosJaOcupadosPelaTurma = await prismaClient.horario.findMany({
    where: { disciplina: { turmaId: disciplina.turmaId } },
  });

  // Cria mapas para consulta rápida
  const mapaDisponibilidade = new Set(
    disponibilidadesDoProfessor.map(d => `${d.diaDaSemana}-${d.periodo}`)
  );
  const mapaOcupadoProfessor = new Set(
    horariosJaOcupadosPeloProfessor.map(h => `${h.diaDaSemana}-${h.periodo}`)
  );
  const mapaOcupadoTurma = new Set(
    horariosJaOcupadosPelaTurma.map(h => `${h.diaDaSemana}-${h.periodo}`)
  );

  const horariosParaCriar = [];
  let aulasAlocadas = 0;

  // Função auxiliar para verificar a nova regra de negócio
  const verificaLimiteDeAulasSeguidas = (dia, periodoNum) => {
    let aulasConsecutivas = 0;
    // Olha para trás nos períodos anteriores do mesmo dia
    for (let i = 1; i <= LIMITE_AULAS_SEGUIDAS; i++) {
      const periodoAnterior = `P${periodoNum - i}`;
      const slotAnterior = `${dia}-${periodoAnterior}`;
      
      // Verifica tanto os horários já existentes quanto os que estamos alocando agora
      if (mapaOcupadoProfessor.has(slotAnterior) || horariosParaCriar.some(h => h.diaDaSemana === dia && h.periodo === periodoAnterior)) {
        aulasConsecutivas++;
      } else {
        // Se houver uma falha na sequência, para a contagem
        break;
      }
    }
    return aulasConsecutivas < LIMITE_AULAS_SEGUIDAS;
  };

  // Lógica de "duas passagens" que já tínhamos
  // Passagem 1: Respeitando a disponibilidade
  for (const dia of diasSemana) {
    for (let periodoNum = 1; periodoNum <= 9; periodoNum++) {
      if (aulasAlocadas >= disciplina.cargaHoraria) break;
      const periodoEnum = `P${periodoNum}`;
      const slot = `${dia}-${periodoEnum}`;

      const professorEstaDisponivel = mapaDisponibilidade.has(slot);
      const professorEstaLivre = !mapaOcupadoProfessor.has(slot);
      const turmaEstaLivre = !mapaOcupadoTurma.has(slot);

      if (professorEstaDisponivel && professorEstaLivre && turmaEstaLivre) {
        // ***** NOVA VERIFICAÇÃO *****
        if (verificaLimiteDeAulasSeguidas(dia, periodoNum)) {
          horariosParaCriar.push({ disciplinaId: disciplina.id, diaDaSemana: dia, periodo: periodoEnum });
          mapaOcupadoProfessor.add(slot); // Adicionamos ao mapa para que a próxima iteração considere este slot
          aulasAlocadas++;
        }
      }
    }
    if (aulasAlocadas >= disciplina.cargaHoraria) break;
  }

  // Passagem 2: Ignorando a disponibilidade se necessário
  if (aulasAlocadas < disciplina.cargaHoraria) {
    for (const dia of diasSemana) {
      for (let periodoNum = 1; periodoNum <= 9; periodoNum++) {
        if (aulasAlocadas >= disciplina.cargaHoraria) break;
        const periodoEnum = `P${periodoNum}`;
        const slot = `${dia}-${periodoEnum}`;

        const professorEstaLivre = !mapaOcupadoProfessor.has(slot);
        const turmaEstaLivre = !mapaOcupadoTurma.has(slot);

        if (professorEstaLivre && turmaEstaLivre) {
          // ***** NOVA VERIFICAÇÃO (também aplicada aqui) *****
          if (verificaLimiteDeAulasSeguidas(dia, periodoNum)) {
            horariosParaCriar.push({ disciplinaId: disciplina.id, diaDaSemana: dia, periodo: periodoEnum });
            mapaOcupadoProfessor.add(slot);
            aulasAlocadas++;
          }
        }
      }
      if (aulasAlocadas >= disciplina.cargaHoraria) break;
    }
  }

  if (horariosParaCriar.length > 0) {
    await prismaClient.horario.createMany({
      data: horariosParaCriar,
    });
  }
  
  return aulasAlocadas === disciplina.cargaHoraria;
};

module.exports = {
  alocarHorariosParaDisciplina,
};