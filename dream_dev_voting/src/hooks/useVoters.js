import { useState, useEffect } from 'react';
import { voterService } from '../services/voterService';

export function useVoters(electorateId) {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!electorateId) return;
    setLoading(true);
    voterService.getAllVoters(electorateId)
      .then((res) => setVoters(res.data))
      .catch((err) => setError(err?.message ?? 'Failed to load voters'))
      .finally(() => setLoading(false));
  }, [electorateId]);

  return { voters, loading, error };
}
