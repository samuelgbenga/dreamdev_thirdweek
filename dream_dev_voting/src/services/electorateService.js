import apiClient from '../utils/apiClient';

export const electorateService = {
  loginElectorate: (electorateId) =>
      apiClient.post('/electorates/login', null, {
        params: { electorateId }
      }),

  getAllElectorates: (electorateId) =>
    apiClient.get('/electorates', { params: { electorateId } }),

  getVotersByStatus: (electorateId, status) =>
    apiClient.get('/electorates/voters', { params: { electorateId, status } }),

  createElectorate: (data, assignerElectorateId) =>
    apiClient.post('/electorates', { ...data, assignerElectorateId }),

  approveVoter: (voterId, electorateId) =>
    apiClient.post('/electorates/approve-voter', null,
        { params:{voterId, electorateId}}),

  assignPermission: (data) =>
    apiClient.post('/electorates/assign-permission', data),

  removePermission: (data) =>
    apiClient.post('/electorates/remove-permission', data),
};
