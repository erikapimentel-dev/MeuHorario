const express = require('express');
const router = express.Router();
const { getAllTurmasHandler, getTurmaByIdHandler, addTurmaHandler, updateTurmaHandler, deleteTurmaHandler } = require('../controllers/turmaController');

router.get('/', getAllTurmasHandler);
router.get('/:id', getTurmaByIdHandler);
router.post('/', addTurmaHandler);
router.put('/:id', updateTurmaHandler);
router.delete('/:id', deleteTurmaHandler);

module.exports = router;
