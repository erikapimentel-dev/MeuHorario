const prisma = require('../prisma');


const getAllDisponibilidades = async () => {
  return await prisma.disponibilidade.findMany({
    orderBy: {
      diaDaSemana: 'asc'
    },
    orderBy: {
      periodo: 'asc'
    },
  });
}

const getDisponibilidadesByProfessorId = async (professorId) => {
  return await prisma.disponibilidade.findMany({
    where: {
      professorId: professorId
    },
    orderBy: {
      diaDaSemana: 'asc'
    },
    orderBy: {
      periodo: 'asc'
    },
  });
}

const addDisponibilidade = async (professorId, diaDaSemana, periodo) => {
  return await prisma.disponibilidade.create({
    data: {
      professor: {
        connect: {
          id: professorId
        }
      },
      diaDaSemana,
      periodo
    },
  });
}

const updateDisponibilidade = async (id, diaDaSemana, periodo) => {
  return await prisma.disponibilidade.update({
    where: {
      id: id
    },
    data: {
      diaDaSemana,
      periodo
    }
  });
}

const deleteDisponibilidade = async (id) => {
  return await prisma.disponibilidade.delete({
    where: {
      id: id
    }
  });
}

module.exports = {
  getAllDisponibilidades,
  getDisponibilidadesByProfessorId,
  addDisponibilidade,
  updateDisponibilidade,
  deleteDisponibilidade
};


