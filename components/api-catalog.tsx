"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";

import { ApiCard } from "@/components/api-card";
import { FilterSelect, type FilterOption } from "@/components/filter-select";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterApis } from "@/lib/api-filter";
import { useFavorites } from "@/lib/use-favorites";
import { cn } from "@/lib/utils";
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
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<"name" | "updated">("name");

  const { favorites } = useFavorites();

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

  const filtered = useMemo(() => {
    const base = filterApis(items, { query, category, method, status });
    const scoped = favoritesOnly
      ? base.filter((item) => favorites.includes(item.id))
      : base;
    const sorted = [...scoped];
    if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else {
      // 최근 수정순(내림차순). updated는 ISO 문자열이라 문자열 비교로 정렬 가능.
      sorted.sort((a, b) => (b.updated ?? "").localeCompare(a.updated ?? ""));
    }
    return sorted;
  }, [items, query, category, method, status, favoritesOnly, favorites, sort]);

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
          <Button
            type="button"
            variant={favoritesOnly ? "secondary" : "outline"}
            size="default"
            aria-pressed={favoritesOnly}
            onClick={() => setFavoritesOnly((v) => !v)}
          >
            <Star
              className={cn(favoritesOnly && "fill-yellow-400 text-yellow-400")}
              aria-hidden
            />
            즐겨찾기만
          </Button>
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as "name" | "updated")}
          >
            <SelectTrigger aria-label="정렬">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">정렬: 이름순</SelectItem>
              <SelectItem value="updated">정렬: 최근 수정순</SelectItem>
            </SelectContent>
          </Select>
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
