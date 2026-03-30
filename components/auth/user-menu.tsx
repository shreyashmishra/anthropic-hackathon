"use client";

import { useRouter } from "next/navigation";
import { useSessionUser } from "@/components/auth/session-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, LogOut, User } from "lucide-react";
import { toast } from "sonner";

export function UserMenu() {
  const { user, setUser } = useSessionUser();
  const router = useRouter();

  if (!user) return null;

  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuItem asChild>
          <a href="/profile" className="cursor-pointer">
            <User className="h-4 w-4 mr-2" />
            Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/bookmarks" className="cursor-pointer">
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmarks
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            const response = await fetch("/api/logout", { method: "POST" });
            if (!response.ok) {
              toast.error("Failed to log out");
              return;
            }

            setUser(null);
            toast.success("Logged out");
            router.push("/");
            router.refresh();
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
