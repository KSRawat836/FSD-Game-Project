import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/scores';

export const getScores = (game) => axios.get(API_BASE, { params: { game } });
export const submitScore = (data) => axios.post(`${API_BASE}/submit`, data);
export const updateScore = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteScore = (id) => axios.delete(`${API_BASE}/${id}`);
