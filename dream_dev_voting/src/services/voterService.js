import apiClient from '../utils/apiClient';

export const voterService = {
  registerVoter: (voterData) =>
    apiClient.post('/voters/register', voterData),

  initiateVote: (voteData) =>
    apiClient.post('/voters/vote', voteData),

  confirmVote: (token) =>
    apiClient.put(`/voters/complete_vote?token=${token}`),

  getAllVoters: (electorateId) =>
    apiClient.get('/voters/all', { params: { electorateId } }),
};
