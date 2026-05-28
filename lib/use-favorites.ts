"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * 즐겨찾기(북마크)를 브라우저 localStorage에 저장하는 훅.
 * 로그인 없이 동작하며, useSyncExternalStore로 SSR-안전하게 외부 저장소를 구독한다.
 */

const KEY = "api-catalog:favorites";
const EVENT = "api-catalog:favorites-changed";

function parse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

// 같은 raw 문자열이면 동일 참조를 반환해 useSyncExternalStore 무한 루프를 막는다.
let cache: { raw: string | null; value: string[] } = { raw: null, value: [] };

function getSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw !== cache.raw) cache = { raw, value: parse(raw) };
  return cache.value;
}

const SERVER_SNAPSHOT: string[] = [];
function getServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function writeFavorites(ids: string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // 저장 불가(시크릿 모드 등)는 조용히 무시
  }
}

export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback((id: string) => {
    const current = getSnapshot();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    writeFavorites(next);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  return { favorites, isFavorite, toggle };
}
