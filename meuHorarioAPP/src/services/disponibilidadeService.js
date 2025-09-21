import api from './api';

export const findDisponibilidades = async () => api.get('/disponibilidades/');
export const findDisponibilidadeById = async (id) => api.get(`/disponibilidades/${id}`);
export const addDisponibilidade = async (payload) => api.post('/disponibilidades/', payload);
export const updateDisponibilidade = async (id, payload) => api.put(`/disponibilidades/${id}`, payload);
export const deleteDisponibilidade = async (id) => api.delete(`/disponibilidades/${id}`);
export const findDisponibilidadesByProfessor = async (professorId) => 
  api.get(`/disponibilidades/professor/${professorId}`);