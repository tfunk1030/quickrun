import { useState, useEffect } from "react";
import { searchRepositories, Repository, runRepository } from "@/api/repository";
import { RepositoryCard } from "@/components/RepositoryCard";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";

export function Repositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRepositories = async () => {
      if (!search.trim()) return;
      setLoading(true);
      try {
        const data = await searchRepositories(search);
        setRepositories(data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch repositories. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchRepositories();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, toast]);

  const handleRun = async (id: string) => {
    try {
      await runRepository(id);
      toast({
        title: "Success",
        description: "Repository is now running",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to run repository",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {!loading && repositories.length === 0 && <p>No repositories found.</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repo) => (
          <RepositoryCard
            key={repo.id}
            repository={repo}
            onRun={() => handleRun(repo.id)}
          />
        ))}
      </div>
    </div>
  );
}