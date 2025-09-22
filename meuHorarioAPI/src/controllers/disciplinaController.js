const prisma = require('../prisma');
const {
  getAlldisciplinas,
  getDisciplinaById,
  addDisciplina,
  updateDisciplina,
  deleteDisciplina
} = require('../models/disciplinaModel');
const { alocarHorariosParaDisciplina } = require('../services/geradorHorarioService');


const getAllDisciplinasHandler = async (req, res) => {
  try {
    const disciplinas = await getAlldisciplinas();
    res.status(200).json(disciplinas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
}

const getDisciplinaByIdHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const disciplina = await getDisciplinaById(id);
        if (!disciplina) {
            return res.status(404).json({ error: "Disciplina não encontrada" });
        }
        res.status(200).json(disciplina);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar disciplina' });
    }
}

const addDisciplinaHandler = async (req, res) => {
    try {
        const nome = req.body.nome;
        const cargaHoraria = parseInt(req.body.cargaHoraria);
        const professorId = parseInt(req.body.professorId);
        const turmaId = parseInt(req.body.turmaId);

        if (!nome || !professorId || !turmaId || Number.isNaN(cargaHoraria)) {
            return res.status(400).json({ error: "Campos inválidos. Informe nome, professorId, turmaId e cargaHoraria." });
        }

        const professor = await prisma.professor.findUnique({ where: { id: parseInt(professorId) } });
        if (!professor) return res.status(404).json({ error: "Professor não encontrado" });
        const turma = await prisma.turma.findUnique({ where: { id: parseInt(turmaId) } });
        if (!turma) return res.status(404).json({ error: "Turma não encontrada" });

        // Primeiro, cria a disciplina no banco
        const novaDisciplina = await addDisciplina({ professorId: parseInt(professorId), turmaId: parseInt(turmaId), nome, cargaHoraria });

        // 2. A MÁGICA ACONTECE AQUI!
        // Após criar, chamamos nosso serviço para alocar os horários para essa nova disciplina.
        await alocarHorariosParaDisciplina(novaDisciplina);
        
        return res.status(201).json(novaDisciplina);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar disciplina' });
    }
}

const updateDisciplinaHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, cargaHoraria } = req.body;
    try {
        const disciplinaAtualizada = await updateDisciplina(id, nome, cargaHoraria);
        res.status(200).json(disciplinaAtualizada);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar disciplina' });
    }
}

const deleteDisciplinaHandler = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const disciplina = await deleteDisciplina(id);
        res.status(200).json({ message: 'Disciplina deletada com sucesso' });
    } catch (error) {
        if(error.message === 'Disciplina não encontrada') {
            return res.status(404).json({ error: "Disciplina não encontrada" });
        }
        res.status(500).json({ error: error.message || "Erro ao deletar disciplina" });
    }
}

module.exports = {
  getAllDisciplinasHandler,
  getDisciplinaByIdHandler,
  addDisciplinaHandler,
  updateDisciplinaHandler,
  deleteDisciplinaHandler
};