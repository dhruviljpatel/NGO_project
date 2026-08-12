import api from './api';

export const getBeneficiaries = async () => {
  const response = await api.get('/beneficiaries');
  return response.data.data;
};

export const getBeneficiaryById = async (id: string) => {
  const response = await api.get(`/beneficiaries/${id}`);
  return response.data.data;
};

export const createBeneficiary = async (data: any) => {
  const response = await api.post('/beneficiaries', data);
  return response.data.data;
};

export const updateBeneficiary = async (id: string, data: any) => {
  const response = await api.put(`/beneficiaries/${id}`, data);
  return response.data.data;
};
