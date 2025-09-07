const {getAllDisponibilidades, getDisponibilidadesByProfessorId, addDisponibilidade, updateDisponibilidade, deleteDisponibilidade} = require('../models/disponibilidadeModel');

const getAllDisponibilidadesHandler = async (req, res) => {
  try {
    const disponibilidades = await getAllDisponibilidades();
    res.status(200).json(disponibilidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar disponibilidades' });
  }
}

const getDisponibilidadesByProfessorIdHandler = async (req, res) => {
  const professorId = parseInt(req.params.professorId);
  try {
    const disponibilidades = await getDisponibilidadesByProfessorId(professorId);
    res.status(200).json(disponibilidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar disponibilidades do professor' });
  }
}

const addDisponibilidadeHandler = async (req, res) => {
  const professorId = parseInt(req.body.professorId);
  const diaDaSemana = req.body.diaDaSemana;
  const periodo = req.body.periodo;
  try {
    const novaDisponibilidade = await addDisponibilidade(professorId, diaDaSemana, periodo);
    res.status(201).json(novaDisponibilidade);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar disponibilidade' });
  }
}

const updateDisponibilidadeHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  const diaDaSemana = req.body.diaDaSemana;
  const periodo = req.body.periodo;
  try {
    const disponibilidadeAtualizada = await updateDisponibilidade(id, diaDaSemana, periodo);
    res.status(200).json(disponibilidadeAtualizada);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar disponibilidade' });
  }
}

const deleteDisponibilidadeHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
        const disponibilidade = await deleteDisponibilidade(id);
        res.status(200).json({ message: 'Disponibilidade deletada com sucesso' });
    } catch (error) {
        if(error.message === 'Disponibilidade não encontrada') {
            return res.status(404).json({ error: "Disponibilidade não encontrada" });
        }
        res.status(500).json({ error: error.message || "Erro ao deletar disponibilidade" });
    }
}

module.exports = {
  getAllDisponibilidadesHandler,
  getDisponibilidadesByProfessorIdHandler,
  addDisponibilidadeHandler,
  updateDisponibilidadeHandler,
  deleteDisponibilidadeHandler
};  