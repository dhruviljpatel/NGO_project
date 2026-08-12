import api from './api';

export const getVolunteers = async () => {
  const response = await api.get('/volunteers');
  return response.data.data;
};

export const getVolunteerById = async (id: string) => {
  const response = await api.get(`/volunteers/${id}`);
  return response.data.data;
};

export const updateVolunteer = async (id: string, data: any) => {
  const response = await api.put(`/volunteers/${id}`, data);
  return response.data.data;
};

export const deactivateVolunteer = async (id: string) => {
  const response = await api.delete(`/volunteers/${id}`);
  return response.data.data;
};
