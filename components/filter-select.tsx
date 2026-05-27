"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  label: string;
  value: string;
}

/** "전체"를 나타내는 내부 sentinel (빈 문자열 value 회피). */
const ALL = "__all__";

/**
 * 제어형 단일 선택 필터. `value === ""`는 전체(필터 없음)를 의미한다.
 * 카테고리/메서드/상태 필터(Phase 4)에서 동일하게 재사용한다.
 */
export function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel = "전체",
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  allLabel?: string;
  className?: string;
}) {
  return (
    <Select
      value={value === "" ? ALL : value}
      onValueChange={(next) => onChange(next === ALL ? "" : String(next))}
    >
      <SelectTrigger className={className} aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>
          {label}: {allLabel}
        </SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
