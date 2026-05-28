"use client";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/use-favorites";
import { cn } from "@/lib/utils";

/** 즐겨찾기 별표 토글 버튼. 카드 위에 겹쳐 쓰므로 클릭이 링크로 전파되지 않게 막는다. */
export function FavoriteButton({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(id);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={active ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      aria-pressed={active}
      className={cn("text-muted-foreground", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
    >
      <Star className={cn(active && "fill-yellow-400 text-yellow-400")} aria-hidden />
    </Button>
  );
}
