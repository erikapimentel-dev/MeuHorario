import api from './api';

export const findDisciplinas = async () => api.get('/disciplinas/');
export const findDisciplinaById = async (id) => api.get(`/disciplinas/${id}`);
export const addDisciplina = async (payload) => api.post('/disciplinas/', payload);
export const updateDisciplina = async (id, payload) => api.put(`/disciplinas/${id}`, payload);
export const deleteDisciplina = async (id) => api.delete(`/disciplinas/${id}`);
