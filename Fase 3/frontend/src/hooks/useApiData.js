import { useEffect, useState } from 'react';

export function useApiData(load, initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.resolve().then(load).then(result => {
      if (active) setData(result);
    }).catch(failure => {
      if (active) setError(failure);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [load, revision]);

  return { data, loading, error, reload: () => setRevision(value => value + 1) };
}
