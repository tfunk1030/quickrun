import { useState, useEffect } from "react";
import { searchRepositories, Repository, runRepository } from "@/api/repository";
import { RepositoryCard } from "@/components/RepositoryCard";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";

export function Repositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchRepositories = async () => {
      console.log("Fetching repositories with search query:", search);
      try {
        const data = await searchRepositories(search);
        console.log("Received repository data:", data);
        setRepositories(data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };
    fetchRepositories();
  }, [search]);

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