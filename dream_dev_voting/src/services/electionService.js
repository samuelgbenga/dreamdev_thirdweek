import apiClient from '../utils/apiClient';

export const electionService = {
  getAllElections: () =>
    apiClient.get('/elections'),

  getElectionsByState: (state) =>
    apiClient.get('/elections/getbystate', { params: { state } }),

  getElectionsByStateAndDate: (state, date) =>
    apiClient.get('/elections/getbystateanddate', { params: { state, date } }),

  uploadElections: (electorateId, file) => {
    const form = new FormData();
    form.append('file', file);
    return apiClient.post('/elections/upload', form, {
      params: { electorateId },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
