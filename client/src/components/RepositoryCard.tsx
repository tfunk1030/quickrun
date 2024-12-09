import { Repository } from "@/api/repository";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, AlertCircle } from "lucide-react";

type RepositoryCardProps = {
  repository: Repository;
  onRun: () => void;
};

export function RepositoryCard({ repository, onRun }: RepositoryCardProps) {
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
                : 'secondary'
            }
          >
            {repository.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{repository.url}</p>
          <Badge variant="outline">{repository.language}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onRun}
          disabled={repository.status !== 'ready'}
        >
          {repository.status === 'error' ? (
            <AlertCircle className="mr-2 h-4 w-4" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {repository.status === 'ready' ? 'Run' : repository.status === 'error' ? 'Failed' : 'Building...'}
        </Button>
      </CardFooter>
    </Card>
  );
}