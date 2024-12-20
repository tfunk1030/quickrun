import React, { useState, useEffect } from 'react';
import { Repository, runRepository, buildRepository } from "@/api/repository";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Loader2, FileText } from "lucide-react";
import socket from '@/api/socket';
import { useToast } from "@/hooks/useToast";

type RepositoryCardProps = {
  repository: Repository;
  onViewLogs: () => void;
  onStatusChange: (id: string, newStatus: Repository['status']) => void;
};

export function RepositoryCard({ repository: initialRepository, onViewLogs, onStatusChange }: RepositoryCardProps) {
  const [repository, setRepository] = useState(initialRepository);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    socket.on(`repository:${repository.id}:log`, (log: string) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    });

    return () => {
      socket.off(`repository:${repository.id}:log`);
    };
  }, [repository.id]);

  const updateRepositoryStatus = (newStatus: Repository['status']) => {
    setRepository(prev => ({ ...prev, status: newStatus }));
    onStatusChange(repository.id, newStatus);
  };

  const handleBuild = async () => {
    updateRepositoryStatus('building');
    try {
      const buildResult = await buildRepository(repository.id);
      if (buildResult.success) {
        updateRepositoryStatus('ready');
        toast({
          title: "Build Successful",
          description: "Repository has been built successfully",
        });
      } else {
        throw new Error(buildResult.message || "Build failed");
      }
    } catch (error) {
      console.error("Error building repository:", error);
      updateRepositoryStatus('error');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to build repository",
      });
    }
  };

  const handleRun = async () => {
    if (repository.status !== 'ready') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Repository must be built before running",
      });
      return;
    }

    updateRepositoryStatus('running');
    setLogs([]); // Clear logs before running
    try {
      const result = await runRepository(repository.id);
      if (result.success) {
        toast({
          title: "Repository Run",
          description: "Repository has been run successfully",
        });
      } else {
        throw new Error(result.error || "Failed to run repository");
      }
    } catch (error) {
      console.error("Error running repository:", error);
      updateRepositoryStatus('error');
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to run repository",
      });
    } finally {
      // Ensure the 'Run' button becomes clickable again
      updateRepositoryStatus('ready');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{repository.name}</span>
          <Badge
            variant={
              repository.status === 'ready'
                ? 'default'
                : repository.status === 'error'
                ? 'destructive'
                : repository.status === 'building'
                ? 'secondary'
                : 'outline'
            }
          >
            {repository.status || 'Not started'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{repository.url}</p>
          <Badge variant="outline">{repository.language}</Badge>
        </div>
        {logs.length > 0 && (
          <div className="mt-4">
            <h3>Logs:</h3>
            <pre className="bg-gray-100 p-2 rounded">
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {repository.status === 'Not started' || repository.status === 'error' ? (
          <Button onClick={handleBuild} disabled={repository.status === 'building'}>
            {repository.status === 'building' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {repository.status === 'building' ? 'Building...' : 'Build'}
          </Button>
        ) : (
          <Button
            onClick={handleRun}
            disabled={repository.status === 'running' || repository.status === 'building'}
          >
            {repository.status === 'running' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {repository.status === 'running' ? 'Running...' : 'Run'}
          </Button>
        )}
        <Button variant="outline" onClick={onViewLogs}>
          <FileText className="mr-2 h-4 w-4" />
          View Logs
        </Button>
      </CardFooter>
    </Card>
  );
}