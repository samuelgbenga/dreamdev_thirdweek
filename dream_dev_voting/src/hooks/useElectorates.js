import { useState, useEffect } from 'react';
import { electorateService } from '../services/electorateService';

export function useElectorates(electorateId) {
  const [electorates, setElectorates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!electorateId) return;
    setLoading(true);
    electorateService.getAllElectorates(electorateId)
      .then((res) => setElectorates(res.data))
      .catch((err) => setError(err?.message ?? 'Failed to load electorates'))
      .finally(() => setLoading(false));
  }, [electorateId]);

  return { electorates, loading, error };
}
