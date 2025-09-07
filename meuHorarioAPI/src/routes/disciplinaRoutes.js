const express = require('express');
const router = express.Router();
const { getAllDisciplinasHandler, getDisciplinaByIdHandler, addDisciplinaHandler, updateDisciplinaHandler, deleteDisciplinaHandler } = require('../controllers/disciplinaController');

router.get('/', getAllDisciplinasHandler);
router.get('/:id', getDisciplinaByIdHandler);
router.post('/', addDisciplinaHandler);
router.put('/:id', updateDisciplinaHandler);
router.delete('/:id', deleteDisciplinaHandler);

module.exports = router;