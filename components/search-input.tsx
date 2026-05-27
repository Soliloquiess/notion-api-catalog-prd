"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** 제어형 검색 입력. 필터링 로직은 사용하는 쪽(Phase 4)에서 ApiItem[]에 적용한다. */
export function SearchInput({
  value,
  onChange,
  placeholder = "이름·엔드포인트·태그 검색",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="검색"
        className="pl-8"
      />
    </div>
  );
}
