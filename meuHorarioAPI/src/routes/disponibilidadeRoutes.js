const express = require('express');
const router = express.Router();
const { getAllDisponibilidadesHandler, getDisponibilidadesByProfessorIdHandler, addDisponibilidadeHandler, updateDisponibilidadeHandler, deleteDisponibilidadeHandler } = require('../controllers/disponibilidadeController');

router.get('/', getAllDisponibilidadesHandler);
router.get('/professor/:professorId', getDisponibilidadesByProfessorIdHandler);
router.post('/', addDisponibilidadeHandler);
router.put('/:id', updateDisponibilidadeHandler);
router.delete('/:id', deleteDisponibilidadeHandler);

module.exports = router;