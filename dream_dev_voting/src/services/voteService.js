import apiClient from '../utils/apiClient';

export const voteService = {
  getAllVotes: (electorateId, page = 0, size = 20) =>
    apiClient.get('/votes/all', { params: { electorateId, page, size } }),

  getCandidatesSummary: (electionId) =>
    apiClient.get('/votes/candidates-summary', { params: { electionId } }),

  getCandidateSummary: (candidateId) =>
    apiClient.get('/votes/candidate-summary', { params: { candidateId } }),
};
