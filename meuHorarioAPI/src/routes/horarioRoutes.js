const express = require('express');
const router = express.Router();
const  { getAllHorariosHandler, getHorarioByIdHandler, addHorarioHandler, updateHorarioHandler, deleteHorarioHandler } = require('../controllers/horarioController');

router.get('/', getAllHorariosHandler);
router.get('/:id', getHorarioByIdHandler);
router.post('/', addHorarioHandler);
router.put('/:id', updateHorarioHandler);
router.delete('/:id', deleteHorarioHandler);

module.exports = router;