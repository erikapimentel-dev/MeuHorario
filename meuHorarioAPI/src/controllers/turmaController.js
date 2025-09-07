const { getAllTurmas, getTurmaById, addTurma, updateTurma, deleteTurma } = require('../models/turmaModel');

const getAllTurmasHandler = async (req, res) => {
    try {
        const turmas = await getAllTurmas();
        res.status(200).json(turmas);
    } catch (error) {
        res.status(500).json({ error: error.message || "Erro ao buscar turmas" });
    }
}

const getTurmaByIdHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const turma = await getTurmaById(id);

        if(!turma) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        }
        res.status(200).json(turma);
    } catch (error) {
        res.status(500).json({ error: error.message || "Erro ao buscar turma" });
    }
}

const addTurmaHandler = async (req, res) => {
    const { nome } = req.body;

    try {
        const newTurma = await addTurma(nome);
        res.status(201).json(newTurma);
    } catch (error) {
        res.status(500).json({ error: error.message || "Erro ao adicionar turma" });
    }
}

const updateTurmaHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome } = req.body;

    if(!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    try {
        const updatedTurma = await updateTurma(id, nome);
        res.status(200).json(updatedTurma);
    } catch (error) {
        if(error.message === 'Turma não encontrada') {
            return res.status(404).json({ error: "Turma não encontrada" });
        }
        res.status(500).json({ error: error.message || "Erro ao atualizar turma" });
    }
}

const deleteTurmaHandler = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const turma = await deleteTurma(id);
        res.status(200).json({ message: 'Turma deletada com sucesso' });
    } catch (error) {
        if(error.message === 'Turma não encontrada') {
            return res.status(404).json({ error: "Turma não encontrada" });
        }
        res.status(500).json({ error: error.message || "Erro ao deletar turma" });
    }
}

module.exports = {
    getAllTurmasHandler,
    getTurmaByIdHandler,
    addTurmaHandler,
    updateTurmaHandler,
    deleteTurmaHandler
}
