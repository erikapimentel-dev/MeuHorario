const prisma = require('../prisma');


const getAllPeriodos = async () => {
    return await prisma.periodo.findMany();
}

const getPeriodoById = async (id) => {
    return await prisma.periodo.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            DiaDaSemana: true,
            disciplina: true
        }
    })
}

const addPeriodo = async (diaDaSemana, disciplinaId) => {
    return await prisma.periodo.create({
        data: {
            diaDaSemana: diaDaSemana,
            disciplina: { connect: { id: disciplinaId } },
                        
        }
    })
}

const updatePeriodo = async (id, diaDaSemana, disciplinaId) => {
    const periodo = await prisma.periodo.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!periodo) {
        throw new Error('Período não encontrado');
    }

    return await prisma.periodo.update({
        where: {
            id: parseInt(id)
        },
        data: {
            diaDaSemana: diaDaSemana,
            disciplina: { connect: { id: disciplinaId } },
        
        }
    })
}

const deletePeriodo = async (id) => {
    const periodo = await prisma.periodo.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!periodo) {
        throw new Error('Período não encontrado');
    }

    return await prisma.periodo.delete({
        where: {
            id: parseInt(id)
        }
    })
}

module.exports = {
    getAllPeriodos,
    getPeriodoById,
    addPeriodo,
    updatePeriodo,
    deletePeriodo 
}