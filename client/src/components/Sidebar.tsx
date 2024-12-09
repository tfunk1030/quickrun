import { Home, GitFork, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Repositories", icon: GitFork, path: "/repositories" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {items.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn("w-full justify-start")}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}