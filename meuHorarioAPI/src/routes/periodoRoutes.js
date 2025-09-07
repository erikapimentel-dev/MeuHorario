const express = require('express');
const router = express.Router();
const { getAllPeriodosHandler, getPeriodoByIdHandler, addPeriodoHandler, updatePeriodoHandler, deletePeriodoHandler } = require('../controllers/periodoController');

router.get('/', getAllPeriodosHandler);
router.get('/:id', getPeriodoByIdHandler);
router.post('/', addPeriodoHandler);
router.put('/:id', updatePeriodoHandler);
router.delete('/:id', deletePeriodoHandler);

module.exports = router;