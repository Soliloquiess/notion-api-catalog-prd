import { Badge } from "@/components/ui/badge";
import { statusBadgeClass } from "@/lib/api-display";
import { cn } from "@/lib/utils";

/** API 상태 뱃지. 색 + 상태 라벨(운영/베타/지원종료)을 함께 표기한다(접근성). */
export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  if (!status) return null;
  return (
    <Badge className={cn(statusBadgeClass(status), className)}>{status}</Badge>
  );
}
