import api from './api';

export const findTurmas = async () => api.get('/turmas/');
export const findTurmaById = async (id) => api.get(`/turmas/${id}`);
export const addTurma = async (payload) => api.post('/turmas/', payload);
export const updateTurma = async (id, payload) => api.put(`/turmas/${id}`, payload);
export const deleteTurma = async (id) => api.delete(`/turmas/${id}`);
