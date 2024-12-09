import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRepository } from '@/api/repository';
import { Repository } from '@/api/repository';

export function RepositoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        if (id) {
          const data = await getRepository(id);
          setRepository(data);
        }
      } catch (err) {
        console.error("Error fetching repository details:", err);
        setError('Failed to fetch repository details');
      } finally {
        setLoading(false);
      }
    };

    fetchRepository();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!repository) return <div>Repository not found</div>;

  return (
    <div>
      <h1>{repository.name}</h1>
      <p>Status: {repository.status}</p>
      <p>Language: {repository.language}</p>
      <a href={repository.url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
      <h2>Build Logs:</h2>
      <ul>
        {repository.buildLogs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}