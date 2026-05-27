import { Badge } from "@/components/ui/badge";
import { methodBadgeClass } from "@/lib/api-display";
import { cn } from "@/lib/utils";

/** HTTP 메서드 뱃지. 색 + 메서드 텍스트를 함께 표기한다(접근성). */
export function MethodBadge({
  method,
  className,
}: {
  method: string;
  className?: string;
}) {
  const label = method || "—";
  return (
    <Badge className={cn("font-mono", methodBadgeClass(method), className)}>
      {label}
    </Badge>
  );
}
