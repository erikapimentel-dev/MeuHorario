// meuHorarioAPI/src/services/geradorHorarioService.js

const prisma = require('../prisma');

const alocarPeriodosParaDisciplina = async (disciplina, tx) => {
  // Se 'tx' não for fornecido, usa o cliente prisma global. Caso contrário, usa o cliente da transação.
  const prismaClient = tx || prisma;
  const diasSemana = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"];

  // 1. Buscar dados necessários USANDO O CLIENTE CORRETO (prismaClient)
  const disponibilidadesDoProfessor = await prismaClient.disponibilidade.findMany({
    where: { professorId: disciplina.professorId },
  });

  const periodosJaOcupadosPeloProfessor = await prismaClient.periodo.findMany({
    where: { disciplina: { professorId: disciplina.professorId } },
  });

  const periodosJaOcupadosPelaTurma = await prismaClient.periodo.findMany({
    where: { disciplina: { turmaId: disciplina.turmaId } },
  });

  // Transforma as listas em estruturas de busca rápida
  const mapaDisponibilidade = new Set(
    disponibilidadesDoProfessor.map(d => `${d.diaDaSemana}-${d.periodo}`)
  );
  const mapaOcupadoProfessor = new Set(
    periodosJaOcupadosPeloProfessor.map(p => `${p.diaDaSemana}-${p.periodo}`)
  );
  const mapaOcupadoTurma = new Set(
    periodosJaOcupadosPelaTurma.map(p => `${p.diaDaSemana}-${p.periodo}`)
  );

  const periodosParaCriar = [];
  let aulasAlocadas = 0;

  // 2. Aplicar as regras para encontrar slots válidos
  for (const dia of diasSemana) {
    for (let periodo = 1; periodo <= 6; periodo++) {
      if (aulasAlocadas >= disciplina.cargaHoraria) break;

      const slot = `${dia}-${periodo}`;

      // Regras de negócio
      const professorEstaDisponivel = mapaDisponibilidade.has(slot);
      const professorEstaLivre = !mapaOcupadoProfessor.has(slot);
      const turmaEstaLivre = !mapaOcupadoTurma.has(slot);

      if (professorEstaDisponivel && professorEstaLivre && turmaEstaLivre) {
        periodosParaCriar.push({
          disciplinaId: disciplina.id,
          diaDaSemana: dia,
          periodo: periodo
        });
        
        mapaOcupadoProfessor.add(slot);
        mapaOcupadoTurma.add(slot);
        
        aulasAlocadas++;
      }
    }
    if (aulasAlocadas >= disciplina.cargaHoraria) break;
  }

  // 3. Salvar os períodos encontrados USANDO O CLIENTE CORRETO (prismaClient)
  if (periodosParaCriar.length > 0) {
    await prismaClient.periodo.createMany({
      data: periodosParaCriar,
    });
  }
  
  return aulasAlocadas === disciplina.cargaHoraria;
};

module.exports = {
  alocarPeriodosParaDisciplina,
};