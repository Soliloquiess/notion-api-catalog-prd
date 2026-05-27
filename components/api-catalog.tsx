"use client";

import { useMemo, useState } from "react";

import { ApiCard } from "@/components/api-card";
import { FilterSelect, type FilterOption } from "@/components/filter-select";
import { SearchInput } from "@/components/search-input";
import { filterApis } from "@/lib/api-filter";
import type { ApiItem } from "@/types/api";

/** 고유 값(빈 값 제외)으로 필터 옵션을 만든다. */
function toOptions(values: string[]): FilterOption[] {
  return Array.from(new Set(values.filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, "ko"))
    .map((value) => ({ label: value, value }));
}

/**
 * 검색 + 카테고리/메서드/상태 필터를 클라이언트에서 결합 적용한다.
 * 추가 Notion 호출 없이 서버가 넘긴 ApiItem[]만 거른다.
 */
export function ApiCatalog({
  items,
  hideCategoryFilter = false,
}: {
  items: ApiItem[];
  hideCategoryFilter?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [method, setMethod] = useState("");
  const [status, setStatus] = useState("");

  const categoryOptions = useMemo(
    () => toOptions(items.map((i) => i.category)),
    [items],
  );
  const methodOptions = useMemo(
    () => toOptions(items.map((i) => i.method)),
    [items],
  );
  const statusOptions = useMemo(
    () => toOptions(items.map((i) => i.status)),
    [items],
  );

  const filtered = useMemo(
    () => filterApis(items, { query, category, method, status }),
    [items, query, category, method, status],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          className="sm:w-72"
        />
        <div className="flex flex-wrap gap-2">
          {!hideCategoryFilter && (
            <FilterSelect
              label="카테고리"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
            />
          )}
          <FilterSelect
            label="메서드"
            value={method}
            onChange={setMethod}
            options={methodOptions}
          />
          <FilterSelect
            label="상태"
            value={status}
            onChange={setStatus}
            options={statusOptions}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length}개 표시
        {filtered.length !== items.length && ` (전체 ${items.length}개 중)`}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ApiCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          조건에 맞는 API가 없습니다.
        </div>
      )}
    </div>
  );
}
