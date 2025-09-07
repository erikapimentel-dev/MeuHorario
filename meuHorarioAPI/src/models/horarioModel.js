const prisma = require('../prisma');


const getAllHorarios = async () => {
    return await prisma.horario.findMany({
        include: {
            disciplina: true
        }
    });
}

const getHorarioById = async (id) => {
    return await prisma.horario.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            disciplina: true
        }
    })
}

const addHorario = async (disciplinaId) => {
    return await prisma.horario.create({
        data: {
            disciplina: { connect: { id: disciplinaId } },
                        
        }
    })
}

const updateHorario = async (id, disciplinaId) => {
    const horario = await prisma.horario.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if (!horario) {
        throw new Error('Horário não encontrado');
    }

    return await prisma.horario.update({
        where: {
            id: parseInt(id)
        },
        data: {
            disciplina: { connect: { id: disciplinaId } },
        
        }
    })
}

const deleteHorario = async (id) => {
    const horario = await prisma.horario.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if (!horario) {
        throw new Error('Horário não encontrado');
    }

    return await prisma.horario.delete({
        where: {
            id: parseInt(id)
        }
    })
}

module.exports = {
    getAllHorarios,
    getHorarioById,
    addHorario,
    updateHorario,
    deleteHorario
}