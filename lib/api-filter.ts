import type { ApiItem } from "@/types/api";

export interface ApiFilters {
  /** 이름·엔드포인트·태그 대상 키워드 */
  query: string;
  /** 카테고리 정확 일치. ""=전체 */
  category: string;
  /** HTTP 메서드 정확 일치. ""=전체 */
  method: string;
  /** 상태 정확 일치. ""=전체 */
  status: string;
}

export const EMPTY_FILTERS: ApiFilters = {
  query: "",
  category: "",
  method: "",
  status: "",
};

/**
 * 검색 + 3종 필터를 결합 적용하는 순수 함수.
 * 추가 Notion 호출 없이 메모리상의 ApiItem[]만 거른다(클라이언트 필터링).
 */
export function filterApis(items: ApiItem[], filters: ApiFilters): ApiItem[] {
  const q = filters.query.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.method && item.method !== filters.method) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (q) {
      const haystack = [item.name, item.endpoint, ...item.tags]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
