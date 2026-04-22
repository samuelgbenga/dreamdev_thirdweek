import { useState, useEffect } from 'react';
import { voteService } from '../services/voteService';

export function useVotes(electorateId, page = 0, size = 20) {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!electorateId) return;
    setLoading(true);
    voteService.getAllVotes(electorateId, page, size)
      .then((res) => setVotes(res.data))
      .catch((err) => setError(err?.message ?? 'Failed to load votes'))
      .finally(() => setLoading(false));
  }, [electorateId, page, size]);

  return { votes, loading, error };
}
