const { getAllProfessores, getProfessorById, addProfessor, updateProfessor, deleteProfessor } = require('../models/professorModel')

const getAllProfessoresHandler = async (req, res) => {
    try {
        const professores = await getAllProfessores();
        res.status(200).json(professores);
    } catch (error) {
        res.status(500).json({ error: error.message || "Erro ao buscar professores" });
    }
}

const getProfessorByIdHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const professor = await getProfessorById(id);

        if(!professor) {
            return res.status(404).json({ error: 'Professor não encontrado' });
        }
        res.status(200).json(professor);
    } catch (error) {
        res.status(500).json({ error: error.message || "Erro ao buscar professor" });
    }
}

const addProfessorHandler = async (req, res) => {
    const { nome } = req.body;

    try {
        const newProfessor = await addProfessor(nome);
        res.status(201).json(newProfessor);
    } catch (error) {
        res.status(500).json({ error: error.message || "Erro ao adicionar professor" });
    }
}

const updateProfessorHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, disciplinas, disponibilidades } = req.body;

    if(!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    try {
        const updatedProfessor = await updateProfessor(id, nome);
        res.status(200).json(updatedProfessor);
    } catch (error) {
        if(error.message === 'Professor não encontrado') {
            return res.status(404).json({ error: "Professor não encontrado" });
        }
        res.status(500).json({ error: error.message || "Erro ao atualizar professor" });
    }
}

const deleteProfessorHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const professor = await deleteProfessor(id);
        res.status(200).json({ message: 'Professor deletado com sucesso' });
    } catch (error) {
        if(error.message === 'Professor não encontrado') {
            return res.status(404).json({ error: "Professor não encontrado" });
        }
        res.status(500).json({ error: error.message || "Erro ao deletar professor" });
    }
}

module.exports = {
    getAllProfessoresHandler,
    getProfessorByIdHandler,
    addProfessorHandler,
    updateProfessorHandler,
    deleteProfessorHandler
}