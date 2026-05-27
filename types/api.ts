import type { PageObjectResponse } from "@notionhq/client";

/**
 * 앱 전역에서 쓰는 API 항목 타입.
 * Notion 스키마(Name/Category/Method/Endpoint/Provider/Auth/Status/Tags/Version/Updated)와
 * 이 타입 사이의 변환은 아래 `mapPageToApiItem` 한 곳에서만 일어난다.
 * Notion 스키마가 바뀌면 이 파일만 고친다. (PRD 리스크: 스키마 변경으로 매핑 깨짐)
 */
export interface ApiItem {
  id: string;
  name: string;
  category: string;
  /** HTTP 메서드 (대문자 정규화). 예: GET / POST */
  method: string;
  endpoint: string;
  provider: string;
  auth: string;
  /** 상태 라벨 (운영 / 베타 / 지원종료) */
  status: string;
  tags: string[];
  version: string;
  /** 마지막 수정 시각 (ISO 8601) */
  updated: string;
  /** Notion 페이지 URL */
  url: string;
}

type Properties = PageObjectResponse["properties"];
type Property = Properties[string];

function plainText(rich: { plain_text: string }[]): string {
  return rich
    .map((r) => r.plain_text)
    .join("")
    .trim();
}

function readTitle(p: Property | undefined): string {
  return p?.type === "title" ? plainText(p.title) : "";
}

function readRichText(p: Property | undefined): string {
  return p?.type === "rich_text" ? plainText(p.rich_text) : "";
}

/** select 또는 status 타입 모두에서 이름을 읽는다(스키마 변경 내성). */
function readSelect(p: Property | undefined): string {
  if (p?.type === "select") return p.select?.name ?? "";
  if (p?.type === "status") return p.status?.name ?? "";
  return "";
}

function readMultiSelect(p: Property | undefined): string[] {
  return p?.type === "multi_select" ? p.multi_select.map((o) => o.name) : [];
}

function readLastEditedTime(p: Property | undefined): string {
  return p?.type === "last_edited_time" ? p.last_edited_time : "";
}

/**
 * Notion 페이지 → ApiItem 단일 매퍼.
 * 누락/타입 불일치 속성은 기본값(빈 문자열/배열)으로 흡수한다.
 */
export function mapPageToApiItem(page: PageObjectResponse): ApiItem {
  const p = page.properties;
  return {
    id: page.id,
    name: readTitle(p.Name) || "(이름 없음)",
    category: readSelect(p.Category),
    method: readSelect(p.Method).toUpperCase(),
    endpoint: readRichText(p.Endpoint),
    provider: readSelect(p.Provider),
    auth: readSelect(p.Auth),
    status: readSelect(p.Status),
    tags: readMultiSelect(p.Tags),
    version: readRichText(p.Version),
    updated: readLastEditedTime(p.Updated) || page.last_edited_time,
    url: page.url,
  };
}
