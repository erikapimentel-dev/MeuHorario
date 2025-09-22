// meuHorarioAPI/src/services/geradorHorarioService.js
const prisma = require('../prisma');

const NOMES_PROFESSORES_PRIORITARIOS = ['eletiva', 'clube'];

const alocarHorariosParaDisciplina = async (disciplina, tx) => {
    const prismaClient = tx || prisma;

    // --- GARANTIA: se já existe horário para a disciplina, não alocar de novo ---
    const existentes = await prismaClient.horario.findMany({ where: { disciplinaId: disciplina.id } });
    if (existentes.length > 0) {
        return { sucesso: false, mensagem: 'Disciplina já possui horários alocados', solicitadas: disciplina.cargaHoraria, alocadas: existentes.length };
    }

    const disciplinaCompleta = await prismaClient.disciplina.findUnique({
        where: { id: disciplina.id },
        include: { professor: true },
    });

    if (!disciplinaCompleta) {
        console.error(`Disciplina com ID ${disciplina.id} não encontrada.`); 
        return { sucesso: false, solicitadas: disciplina.cargaHoraria, alocadas: 0 };
    }

    const nomeProfessor = (disciplinaCompleta.professor?.nome || '').toLowerCase();
    const isProfessorPrioritario = NOMES_PROFESSORES_PRIORITARIOS.some(nome => nomeProfessor.includes(nome));

    if (isProfessorPrioritario) {
        const disponibilidades = await prismaClient.disponibilidade.findMany({ where: { professorId: disciplina.professorId } });
        if (disponibilidades.length === 0) {
            return { sucesso: false, solicitadas: disciplina.cargaHoraria, alocadas: 0 };
        }
        const horariosParaCriar = disponibilidades.slice(0, disciplina.cargaHoraria).map(disp => ({
            disciplinaId: disciplina.id,
            diaDaSemana: disp.diaDaSemana,
            periodo: disp.periodo
        }));
        if (horariosParaCriar.length > 0) {
            await prismaClient.horario.createMany({ data: horariosParaCriar });
        }
        return { sucesso: true, solicitadas: disciplina.cargaHoraria, alocadas: horariosParaCriar.length };
    }

    // lógica normal (mantive sua implementação)
    const diasSemana = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"];
    const LIMITE_AULAS_SEGUIDAS = 3;

    const professoresPrioritarios = await prismaClient.professor.findMany({ where: { OR: NOMES_PROFESSORES_PRIORITARIOS.map(nome => ({ nome: { contains: nome, mode: 'insensitive' } })) } });
    const idsProfessoresPrioritarios = professoresPrioritarios.map(p => p.id);
    const disponibilidadesReservadas = await prismaClient.disponibilidade.findMany({ where: { professorId: { in: idsProfessoresPrioritarios } } });
    
    const horariosJaOcupadosPeloProfessor = await prismaClient.horario.findMany({ where: { disciplina: { professorId: disciplina.professorId } } });
    const horariosJaOcupadosPelaTurma = await prismaClient.horario.findMany({ where: { disciplina: { turmaId: disciplina.turmaId } } });

    const mapaSlotsBloqueados = new Set([
        ...disponibilidadesReservadas.map(d => `${d.diaDaSemana}-${d.periodo}`),
        ...horariosJaOcupadosPeloProfessor.map(h => `${h.diaDaSemana}-${h.periodo}`),
        ...horariosJaOcupadosPelaTurma.map(h => `${h.diaDaSemana}-${h.periodo}`)
    ]);

    const disponibilidadesDoProfessor = await prismaClient.disponibilidade.findMany({ where: { professorId: disciplina.professorId } });
    const mapaDisponibilidade = new Set(disponibilidadesDoProfessor.map(d => `${d.diaDaSemana}-${d.periodo}`));
    
    const slotsCandidatos = [];
    for (const dia of diasSemana) {
        let aulasConsecutivas = 0;
        for (let periodoNum = 1; periodoNum <= 9; periodoNum++) {
            const periodoEnum = `P${periodoNum}`;
            const slot = `${dia}-${periodoEnum}`;

            if (mapaSlotsBloqueados.has(slot) || !mapaDisponibilidade.has(slot)) {
                aulasConsecutivas = 0;
                continue;
            }

            if (aulasConsecutivas >= LIMITE_AULAS_SEGUIDAS) {
                continue;
            }
            
            slotsCandidatos.push({ diaDaSemana: dia, periodo: periodoEnum });
            aulasConsecutivas++;
        }
    }

    const horariosParaCriar = slotsCandidatos
        .slice(0, disciplina.cargaHoraria)
        .map(slot => ({
            disciplinaId: disciplina.id,
            diaDaSemana: slot.diaDaSemana,
            periodo: slot.periodo
        }));

    if (horariosParaCriar.length > 0) {
        await prismaClient.horario.createMany({ data: horariosParaCriar });
    }

    const aulasAlocadas = horariosParaCriar.length;
    if (aulasAlocadas < disciplina.cargaHoraria) {
        console.warn(`Atenção: A disciplina "${disciplina.nome}" pedia ${disciplina.cargaHoraria} aulas, mas apenas ${aulasAlocadas} puderam ser alocadas.`);
    }

    return {
        sucesso: aulasAlocadas === disciplina.cargaHoraria,
        solicitadas: disciplina.cargaHoraria,
        alocadas: aulasAlocadas,
    };
};

module.exports = {
    alocarHorariosParaDisciplina,
};
