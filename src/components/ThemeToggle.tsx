// components/ThemeToggle.tsx
"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "hooks/useTheme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Cambiar tema"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : theme === "dark" ? (
            <Moon className="h-5 w-5 text-slate-300" />
          ) : (
            <Monitor className="h-5 w-5 text-blue-400" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/90 dark:bg-black/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-xl">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
        >
          <Sun className="h-4 w-4 text-yellow-500" />
          <span>Claro</span>
          {theme === "light" && <span className="ml-auto text-green-500">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
        >
          <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          <span>Oscuro</span>
          {theme === "dark" && <span className="ml-auto text-green-500">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
        >
          <Monitor className="h-4 w-4 text-blue-500" />
          <span>Sistema</span>
          {theme === "system" && <span className="ml-auto text-green-500">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}