import apiClient from '../utils/apiClient';

export const candidateService = {
  getAllCandidates: () =>
    apiClient.get('/candidates'),

  getCandidatesByElectionId: (electionId) =>
    apiClient.get('/candidates/getbyelectionId', { params: { electionId } }),

  uploadCandidates: (electorateId, file) => {
    const form = new FormData();
    form.append('file', file);
    return apiClient.post('/candidates/upload', form, {
      params: { electorateId },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
