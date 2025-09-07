const express = require('express');
const router = express.Router();
const { getAllProfessoresHandler, getProfessorByIdHandler, addProfessorHandler, updateProfessorHandler, deleteProfessorHandler } = require('../controllers/professorController');

router.get('/', getAllProfessoresHandler);
router.get('/:id', getProfessorByIdHandler);
router.post('/', addProfessorHandler);
router.put('/:id', updateProfessorHandler);
router.delete('/:id', deleteProfessorHandler);

module.exports = router;