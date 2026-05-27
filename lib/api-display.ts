/**
 * API 메서드·상태의 표시 규칙(색상/라벨).
 * 접근성 원칙: 색만으로 정보를 전달하지 않는다 — 색 클래스는 보조 수단이고,
 * 실제 의미는 항상 텍스트(메서드명/상태 라벨)로 함께 표기한다.
 */

/** 메서드별 뱃지 색상 클래스. 알 수 없는 값은 중립색으로 처리. */
export function methodBadgeClass(method: string): string {
  switch (method.toUpperCase()) {
    case "GET":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    case "POST":
      return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
    case "PUT":
      return "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300";
    case "PATCH":
      return "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300";
    case "DELETE":
      return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export type StatusTone = "operational" | "beta" | "deprecated" | "unknown";

export function statusTone(status: string): StatusTone {
  switch (status) {
    case "운영":
      return "operational";
    case "베타":
      return "beta";
    case "지원종료":
      return "deprecated";
    default:
      return "unknown";
  }
}

/** 상태별 뱃지 색상 클래스. */
export function statusBadgeClass(status: string): string {
  switch (statusTone(status)) {
    case "operational":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    case "beta":
      return "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300";
    case "deprecated":
      return "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}
