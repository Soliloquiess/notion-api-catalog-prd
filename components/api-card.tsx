import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FavoriteButton } from "@/components/favorite-button";
import { MethodBadge } from "@/components/method-badge";
import { StatusBadge } from "@/components/status-badge";
import type { ApiItem } from "@/types/api";

/** API 한 건을 카드로 표시. 클릭 시 상세(/apis/[id])로 이동. */
export function ApiCard({ item }: { item: ApiItem }) {
  return (
    <div className="relative">
      <FavoriteButton id={item.id} className="absolute top-2 right-2 z-10" />
      <Link
        href={`/apis/${item.id}`}
        className="block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Card className="h-full transition-colors hover:bg-muted/40">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2 pr-8">
              <MethodBadge method={item.method} />
              <StatusBadge status={item.status} />
            </div>
            <CardTitle className="mt-1">{item.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {item.endpoint && (
              <code className="block truncate rounded bg-muted px-2 py-1 font-mono text-xs">
                {item.endpoint}
              </code>
            )}
            {(item.category || item.tags.length > 0) && (
              <div className="flex flex-wrap gap-1.5">
                {item.category && (
                  <Badge variant="outline">{item.category}</Badge>
                )}
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
