import { useState, useEffect } from "react";
import { searchRepositories, Repository, runRepository, buildRepository, getRepository } from "@/api/repository";
import { RepositoryCard } from "@/components/RepositoryCard";
import { BuildLogsModal } from "@/components/BuildLogsModal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import { Loader2 } from "lucide-react";

export function Repositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRepositories = async () => {
      if (!search.trim()) {
        setRepositories([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await searchRepositories(search);
        setRepositories(data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setError("Failed to fetch repositories. Please try again.");
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
      const result = await runRepository(id);
      if (result.success) {
        setRepositories(repos => repos.map(repo =>
          repo.id === id ? { ...repo, status: 'ready', buildLogs: result.logs } : repo
        ));
        toast({
          title: "Repository Run",
          description: "Repository has been run successfully",
        });
      } else {
        throw new Error("Failed to run repository");
      }
    } catch (error) {
      console.error("Error running repository:", error);
      setRepositories(repos => repos.map(repo =>
        repo.id === id ? { ...repo, status: 'error' } : repo
      ));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to run repository",
      });
    }
  };

  const handleViewLogs = async (id: string) => {
    try {
      const repository = repositories.find(repo => repo.id === id);
      if (repository) {
        setSelectedRepository(repository);
        setIsLogsModalOpen(true);
      } else {
        throw new Error("Repository not found");
      }
    } catch (error) {
      console.error("Error viewing logs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to view logs",
      });
    }
  };

  const handleStatusChange = (id: string, newStatus: Repository['status']) => {
    setRepositories(repos => repos.map(repo =>
      repo.id === id ? { ...repo, status: newStatus } : repo
    ));
  };

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading && (
        <div className="flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Searching repositories...</span>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && repositories.length === 0 && search.trim() !== "" && (
        <p>No repositories found.</p>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repo) => (
          <RepositoryCard
            key={repo.id}
            repository={repo}
            onRun={() => handleRun(repo.id)}
            onViewLogs={() => handleViewLogs(repo.id)}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
      {selectedRepository && (
        <BuildLogsModal
          isOpen={isLogsModalOpen}
          onClose={() => setIsLogsModalOpen(false)}
          logs={selectedRepository.buildLogs}
        />
      )}
    </div>
  );
}