import { useState, useEffect } from 'react';
import { electionService } from '../services/electionService';

export function useElections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    electionService.getAllElections()
      .then((res) => setElections(res.data))
      .catch((err) => setError(err?.message ?? 'Failed to load elections'))
      .finally(() => setLoading(false));
  }, []);

  return { elections, loading, error };
}
