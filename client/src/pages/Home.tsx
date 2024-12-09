import { useState } from "react";
import { useForm } from "react-hook-form";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { buildRepository } from "@/api/repository";
import { useNavigate } from "react-router-dom";

type BuildForm = {
  url: string;
};

export function Home() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BuildForm>();

  const onSubmit = async (data: BuildForm) => {
    try {
      setLoading(true);
      const repository = await buildRepository(data.url);
      toast({
        title: "Success",
        description: "Repository build started",
      });
      reset();
      navigate(`/repositories/${repository.id}`);
    } catch (error) {
      console.error("Error in Home onSubmit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to build repository",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>QuickRun</CardTitle>
          <CardDescription>
            Enter a GitHub repository URL to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                placeholder="https://github.com/user/repo"
                {...register("url", {
                  required: "Repository URL is required",
                  pattern: {
                    value: /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/,
                    message: "Invalid GitHub repository URL"
                  }
                })}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}