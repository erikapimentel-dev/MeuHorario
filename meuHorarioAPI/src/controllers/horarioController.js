const {getAllHorarios, getHorarioById, addHorario, updateHorario, deleteHorario} = require('../models/horarioModel');


const getAllHorariosHandler = async (req, res) => {
    try {
        const horarios = await getAllHorarios();
        res.status(200).json(horarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar horários' });
    }
}

const getHorarioByIdHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const horario = await getHorarioById(id);
        if (!horario) {
            return res.status(404).json({ error: 'Horário não encontrado' });
        }
        res.status(200).json(horario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar horário' });
    }
}

const addHorarioHandler = async (req, res) => {
    const { disciplinaId } = req.body;
    try {
        const novoHorario = await addHorario(disciplinaId);
        res.status(201).json(novoHorario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar horário' });
    }
}

const updateHorarioHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const { disciplinaId } = req.body;
    try {
        const horarioAtualizado = await updateHorario(id, disciplinaId);
        res.status(200).json(horarioAtualizado);
    } catch (error) {
        if(error.message === 'Horário não encontrado') {
            return res.status(404).json({ error: "Horário não encontrado" });
        }
        res.status(500).json({ error: error.message || "Erro ao atualizar horário" });
    }
}

const deleteHorarioHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const horario = await deleteHorario(id);
        res.status(200).json({ message: 'Horário deletado com sucesso' });
    } catch (error) {
        if(error.message === 'Horário não encontrado') {
            return res.status(404).json({ error: "Horário não encontrado" });
        }
        res.status(500).json({ error: error.message || "Erro ao deletar horário" });
    }
}

module.exports = {
    getAllHorariosHandler,
    getHorarioByIdHandler,
    addHorarioHandler,
    updateHorarioHandler,
    deleteHorarioHandler
};