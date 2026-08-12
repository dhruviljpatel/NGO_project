import api from './api';

export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data.data;
};

export const getEventById = async (id: string) => {
  const response = await api.get(`/events/${id}`);
  return response.data.data;
};

export const createEvent = async (eventData: any) => {
  const response = await api.post('/events', eventData);
  return response.data.data;
};

export const updateEvent = async (id: string, eventData: any) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data.data;
};

export const registerForEvent = async (id: string) => {
  const response = await api.post(`/events/${id}/register`);
  return response.data.data;
};

export const cancelRegistration = async (id: string) => {
  const response = await api.post(`/events/${id}/cancel`);
  return response.data.data;
};
