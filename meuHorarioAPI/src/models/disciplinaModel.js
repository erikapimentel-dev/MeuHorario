const prisma = require('../prisma');
const geradorHorarioService = require('../services/geradorHorarioService');


const getAlldisciplinas = async () => {
  return await prisma.disciplina.findMany({
    orderBy: {
      nome: 'asc'
    },
    include: {
      professor: true,
      turma: true,
      periodos: true,
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
      periodos: true,
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

const deleteDisciplina = async (id) => {
  return await prisma.disciplina.delete({
    where: {
      id: id
    }
  });
}

module.exports = {
  getAlldisciplinas,
  getDisciplinaById,
  addDisciplina,
  updateDisciplina,
  deleteDisciplina
};