// meuHorarioAPI/src/models/disponibilidadeModel.js
const prisma = require('../prisma');

const getAllDisponibilidades = async () => {
  return await prisma.disponibilidade.findMany({
    // CORREÇÃO: Combinar a ordenação em um array
    orderBy: [
      { diaDaSemana: 'asc' },
      { periodo: 'asc' },
    ],
  });
}

const getDisponibilidadesByProfessorId = async (professorId) => {
  return await prisma.disponibilidade.findMany({
    where: {
      professorId: professorId
    },
    // CORREÇÃO: Combinar a ordenação em um array
    orderBy: [
      { diaDaSemana: 'asc' },
      { periodo: 'asc' },
    ],
  });
}

// O restante do arquivo está correto e não precisa de alterações
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