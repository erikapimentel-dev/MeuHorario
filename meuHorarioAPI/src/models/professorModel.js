// meuHorarioAPI/src/models/professorModel.js

const prisma = require('../prisma');

// ... (as funções 'getAllProfessores', 'getProfessorById', 'addProfessor' e 'updateProfessor' continuam as mesmas)
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

// AJUSTE NA FUNÇÃO DE EXCLUSÃO
const deleteProfessor = async (id) => {
    const professorId = parseInt(id);

    // Usamos uma transação para garantir que todas as operações funcionem juntas
    return await prisma.$transaction(async (tx) => {
        // 1. Encontrar todas as disciplinas lecionadas pelo professor
        const disciplinasDoProfessor = await tx.disciplina.findMany({
            where: { professorId: professorId },
        });
        const disciplinaIds = disciplinasDoProfessor.map(d => d.id);

        // 2. Se existirem disciplinas, apagar todos os horários associados a elas
        if (disciplinaIds.length > 0) {
            await tx.horario.deleteMany({
                where: {
                    disciplinaId: {
                        in: disciplinaIds,
                    },
                },
            });
        }
        
        // 3. Apagar as disciplinas do professor
        await tx.disciplina.deleteMany({
            where: {
                professorId: professorId,
            },
        });

        // 4. Apagar as disponibilidades do professor
        await tx.disponibilidade.deleteMany({
            where: {
                professorId: professorId,
            },
        });

        // 5. Finalmente, apagar o professor
        const professorDeletado = await tx.professor.delete({
            where: {
                id: professorId,
            },
        });

        return professorDeletado;
    });
};


module.exports = {
    getAllProfessores,
    getProfessorById,
    addProfessor,
    updateProfessor,
    deleteProfessor
};