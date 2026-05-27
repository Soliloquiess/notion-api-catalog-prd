import Link from "next/link";
import { BookOpen } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="size-5" aria-hidden />
          <span>API 연동 카탈로그</span>
        </Link>
        <nav className="flex items-center gap-1">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
