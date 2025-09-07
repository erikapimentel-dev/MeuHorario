const {getAllPeriodos, getPeriodoById, addPeriodo, updatePeriodo, deletePeriodo} = require('../models/periodoModel');
const { periodo } = require('../prisma');


const getAllPeriodosHandler = async (req, res) => {
    try {
        const periodos = await getAllPeriodos();
        res.status(200).json(periodos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar períodos' });
    }
}

const getPeriodoByIdHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const periodo = await getPeriodoById(id);
        if (!periodo) {
            return res.status(404).json({ error: 'Período não encontrado' });
        }
        res.status(200).json(periodo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar período' });
    }
}

const addPeriodoHandler = async (req, res) => {
    const { diaDaSemana, disciplinaId } = req.body;
    try {
        const novoPeriodo = await addPeriodo(diaDaSemana, disciplinaId);
        res.status(201).json(novoPeriodo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar período' });
    }
}

const updatePeriodoHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const { diaDaSemana, disciplinaId } = req.body;
    try {
        const periodoAtualizado = await updatePeriodo(id, diaDaSemana, disciplinaId);
        res.status(200).json(periodoAtualizado);
    } catch (error) {
        if(error.message === 'Período não encontrado') {
            return res.status(404).json({ error: "Período não encontrado" });
        }
        res.status(500).json({ error: error.message || "Erro ao atualizar período" });
    }
}

const deletePeriodoHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const periodo = await deletePeriodo(id);
        res.status(200).json({ message: 'Período deletado com sucesso' });
    } catch (error) {
        if(error.message === 'Período não encontrado') {
            return res.status(404).json({ error: "Período não encontrado" });
        }
        res.status(500).json({ error: error.message || "Erro ao deletar período" });
    }
}

module.exports = {
    getAllPeriodosHandler,
    getPeriodoByIdHandler,
    addPeriodoHandler,
    updatePeriodoHandler,
    deletePeriodoHandler
};