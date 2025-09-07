const prisma = require('../prisma');

const getAllTurmas = async () => {
    return await prisma.turma.findMany({
        orderBy: { nome: 'asc' },
        include: {
            disciplinas: true
        }
    });
}

const getTurmaById = async (id) => {
    return await prisma.turma.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            disciplinas: true
        }
    })
}

const addTurma = async (nome) => {
    return await prisma.turma.create({
        data: {
            nome: nome
        }
    })
}

const updateTurma = async (id, nome) => {
    const turma = await prisma.turma.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!turma) {
        throw new Error('Turma não encontrada');
    }

    return await prisma.turma.update({
        where: {
            id: parseInt(id)
        },
        data: {
            nome: nome
        
        }
    })
}

const deleteTurma = async (id) => {
    const turma = await prisma.turma.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!turma) {
        throw new Error('Turma não encontrada');
    }

    return await prisma.turma.delete({
        where: {
            id: parseInt(id)
        }
    })
}

module.exports = {
    getAllTurmas,
    getTurmaById,
    addTurma,
    updateTurma,
    deleteTurma
};
