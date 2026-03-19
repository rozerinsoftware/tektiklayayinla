import axios from 'axios';

const API_URL = 'http://192.168.1.35:3000';

export const getIlanlar = async () => {
  const response = await axios.get(`${API_URL}/ilanlar`);
  return response.data;
};

export const addIlan = async (ilan) => {
  const response = await axios.post(`${API_URL}/ilanlar`, ilan);
  return response.data;
};

export const updateIlan = async (id, ilan) => {
  const response = await axios.put(`${API_URL}/ilanlar/${id}`, ilan);
  return response.data;
};

export const deleteIlan = async (id) => {
  const response = await axios.delete(`${API_URL}/ilanlar/${id}`);
  return response.data;
};