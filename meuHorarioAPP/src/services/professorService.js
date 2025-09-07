import api from './api';

export const findProfessores = async () => api.get('/professores/');
export const findProfessorById = async (id) => api.get(`/professores/${id}`);
export const addProfessor = async (payload) => api.post('/professores/', payload);
export const updateProfessor = async (id, payload) => api.put(`/professores/${id}`, payload);
export const deleteProfessor = async (id) => api.delete(`/professores/${id}`);
