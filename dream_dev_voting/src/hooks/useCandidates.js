import { useState, useEffect } from 'react';
import { candidateService } from '../services/candidateService';

export function useCandidates(electionId) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!electionId) return;
    setLoading(true);
    candidateService.getCandidatesByElectionId(electionId)
      .then((res) => setCandidates(res.data))
      .catch((err) => setError(err?.message ?? 'Failed to load candidates'))
      .finally(() => setLoading(false));
  }, [electionId]);

  return { candidates, loading, error };
}
