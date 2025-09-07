const prisma = require('../prisma');

const getAllProfessores = async () => {
    return await prisma.professor.findMany({
        orderBy: { nome: 'asc' },
        include: {
            disciplinas: true,
            disponibilidades: true
        }
    });
}

const getProfessorById = async (id) => {
    return await prisma.professor.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            disciplinas: true,
            disponibilidades: true
        }
    })
}

const addProfessor = async (nome) => {
    return await prisma.professor.create({
        data: {
            nome: nome,
        }
    })
}

const updateProfessor = async (id, nome) => {
    const professor = await prisma.professor.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!professor) {
        throw new Error('Professor não encontrado');
    }

    return await prisma.professor.update({
        where: {
            id: parseInt(id)
        },
        data: {
            nome: nome
        
        }
    })
}

const deleteProfessor = async (id) => {
    const professor = await prisma.professor.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!professor) {
        throw new Error('Professor não encontrado');
    }

    return await prisma.professor.delete({
        where: {
            id: parseInt(id)
        }
    })
}

module.exports = {
    getAllProfessores,
    getProfessorById,
    addProfessor,
    updateProfessor,
    deleteProfessor
}