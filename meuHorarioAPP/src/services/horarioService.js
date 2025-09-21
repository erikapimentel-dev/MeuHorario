// meuHorarioAPP/src/services/horarioService.js
import api from './api';

export const findHorarios = async () => api.get('/horarios/');
// Adicione outras funções se precisar no futuro