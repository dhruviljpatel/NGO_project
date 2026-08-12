import api from './api';

export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data.data;
};

export const getProjectById = async (id: string) => {
  const response = await api.get(`/projects/${id}`);
  return response.data.data;
};

export const createProject = async (data: any) => {
  const response = await api.post('/projects', data);
  return response.data.data;
};

export const updateProject = async (id: string, data: any) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data.data;
};

export const assignVolunteer = async (projectId: string, volunteerId: string) => {
  const response = await api.post(`/projects/${projectId}/assign-volunteer`, { volunteerId });
  return response.data.data;
};

export const assignBeneficiary = async (projectId: string, beneficiaryId: string) => {
  const response = await api.post(`/projects/${projectId}/assign-beneficiary`, { beneficiaryId });
  return response.data.data;
};
