import api from './api';

export const getDonations = async () => {
  const response = await api.get('/donations');
  return response.data.data;
};

export const getDonationById = async (id: string) => {
  const response = await api.get(`/donations/${id}`);
  return response.data.data;
};

export const createDonation = async (data: any) => {
  const response = await api.post('/donations', data);
  return response.data.data;
};

export const updateDonation = async (id: string, data: any) => {
  const response = await api.put(`/donations/${id}`, data);
  return response.data.data;
};
