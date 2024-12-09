import { useState, useEffect } from "react";
import { searchRepositories, Repository, buildRepository, getRepository } from "@/api/repository";
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
    console.log("Repositories useEffect triggered. Search query:", search);
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
    console.log("handleRun called for repository:", id);
    try {
      const updatedRepo = await buildRepository(id);
      setRepositories(repos => repos.map(repo => repo.id === id ? updatedRepo : repo));
      toast({
        title: "Build Started",
        description: "Repository build has been initiated",
      });
    } catch (error) {
      console.error("Error building repository:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start repository build",
      });
    }
  };

  const handleViewLogs = async (id: string) => {
    console.log("View Logs clicked for repository:", id);
    try {
      const repository = await getRepository(id);
      console.log("Repository data received:", repository);
      setSelectedRepository(repository);
      setIsLogsModalOpen(true);
      console.log("Logs modal should be open now");
    } catch (error) {
      console.error("Error fetching repository logs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch repository logs",
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