import { Repository } from "@/api/repository";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, AlertCircle, FileText, Loader2 } from "lucide-react";

type RepositoryCardProps = {
  repository: Repository;
  onRun: () => void;
  onViewLogs: () => void;
};

export function RepositoryCard({ repository, onRun, onViewLogs }: RepositoryCardProps) {
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={onRun}
          disabled={repository.status === 'building'}
        >
          {repository.status === 'building' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : repository.status === 'error' ? (
            <AlertCircle className="mr-2 h-4 w-4" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {repository.status === 'ready' ? 'Run' :
           repository.status === 'error' ? 'Failed' :
           repository.status === 'building' ? 'Building...' :
           'Start Build'}
        </Button>
        <Button variant="outline" onClick={onViewLogs}>
          <FileText className="mr-2 h-4 w-4" />
          View Logs
        </Button>
      </CardFooter>
    </Card>
  );
}