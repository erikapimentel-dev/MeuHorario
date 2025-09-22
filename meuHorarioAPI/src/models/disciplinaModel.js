// meuHorarioAPI/src/models/disciplinaModel.js

const prisma = require('../prisma');

// ... (as funções 'getAlldisciplinas', 'getDisciplinaById', 'addDisciplina' e 'updateDisciplina' continuam exatamente as mesmas)
const getAlldisciplinas = async () => {
  return await prisma.disciplina.findMany({
    orderBy: {
      nome: 'asc'
    },
    include: {
      professor: true,
      turma: true,
      horarios: true
    }
  });
}

const getDisciplinaById = async (id) => {
  return await prisma.disciplina.findUnique({
    where: {
      id: id
    },
    include: {
      professor: true,
      turma: true,
      horarios: true
    }
  });
}

const addDisciplina = async ({ nome, cargaHoraria, professorId, turmaId }) => {
  return await prisma.disciplina.create({
    data: {
      nome,
      cargaHoraria,
      professor: { connect: { id: professorId } },
      turma: { connect: { id: turmaId } }
    }
  });
};

const updateDisciplina = async ( id, nome, cargaHoraria ) => {
  return await prisma.disciplina.update({
    where: {
      id: id
    },
    data: {
      nome,
      cargaHoraria
    }
  });
}


// AJUSTE NA FUNÇÃO DE EXCLUSÃO
const deleteDisciplina = async (id) => {
  // Usamos uma transação para garantir que ambas as operações funcionem ou nenhuma delas.
  return await prisma.$transaction(async (tx) => {
    // 1. Primeiro, deletamos todos os horários associados a esta disciplina.
    await tx.horario.deleteMany({
      where: {
        disciplinaId: id,
      },
    });

    // 2. Agora, podemos deletar a disciplina com segurança.
    const disciplinaDeletada = await tx.disciplina.delete({
      where: {
        id: id,
      },
    });

    return disciplinaDeletada;
  });
};


module.exports = {
  getAlldisciplinas,
  getDisciplinaById,
  addDisciplina,
  updateDisciplina,
  deleteDisciplina // A função agora está correta
};