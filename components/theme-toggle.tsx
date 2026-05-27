"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // 아이콘 가시성은 html의 .dark 클래스(CSS)로 전환하므로 서버/클라이언트 렌더가 동일해
  // hydration 불일치가 없다. resolvedTheme은 클릭(=마운트 이후)에서만 읽으므로 안전하다.
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="테마 전환"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden dark:block" aria-hidden />
      <Moon className="block dark:hidden" aria-hidden />
      <span className="sr-only">라이트/다크 모드 전환</span>
    </Button>
  );
}
