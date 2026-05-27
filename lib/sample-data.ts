import "server-only";

import type { BlockWithChildren } from "@/lib/notion";
import type { ApiItem } from "@/types/api";

/**
 * NOTION_API_KEY 가 없을 때 사용하는 데모용 샘플 데이터.
 * 실제 Notion 키를 넣으면 lib/notion.ts 가 자동으로 실데이터 경로로 전환한다.
 */

export const sampleApis: ApiItem[] = [
  {
    id: "sample-balance",
    name: "계좌 잔액 조회",
    category: "계좌",
    method: "GET",
    endpoint: "/v1/accounts/{id}/balance",
    provider: "Coocon",
    auth: "OAuth2",
    status: "운영",
    tags: ["계좌", "잔액"],
    version: "v1",
    updated: "2026-05-20T09:00:00.000Z",
    url: "#",
  },
  {
    id: "sample-payment",
    name: "결제 요청",
    category: "결제",
    method: "POST",
    endpoint: "/v1/payments",
    provider: "Coocon",
    auth: "API Key",
    status: "베타",
    tags: ["결제", "이체"],
    version: "v1",
    updated: "2026-05-22T13:30:00.000Z",
    url: "#",
  },
  {
    id: "sample-txns",
    name: "거래내역 조회",
    category: "계좌",
    method: "GET",
    endpoint: "/v1/accounts/{id}/transactions",
    provider: "Coocon",
    auth: "OAuth2",
    status: "운영",
    tags: ["계좌", "내역"],
    version: "v1",
    updated: "2026-05-18T08:10:00.000Z",
    url: "#",
  },
  {
    id: "sample-token",
    name: "액세스 토큰 발급",
    category: "인증",
    method: "POST",
    endpoint: "/oauth/token",
    provider: "Coocon",
    auth: "OAuth2",
    status: "운영",
    tags: ["인증", "토큰"],
    version: "v1",
    updated: "2026-05-25T17:45:00.000Z",
    url: "#",
  },
  {
    id: "sample-mydata",
    name: "마이데이터 자산 통합조회",
    category: "마이데이터",
    method: "GET",
    endpoint: "/v1/mydata/assets",
    provider: "금융결제원",
    auth: "mTLS",
    status: "베타",
    tags: ["마이데이터", "자산"],
    version: "v2",
    updated: "2026-05-24T11:00:00.000Z",
    url: "#",
  },
  {
    id: "sample-legacy",
    name: "(구) 스크래핑 잔액조회",
    category: "스크래핑",
    method: "POST",
    endpoint: "/legacy/scrape/balance",
    provider: "Coocon",
    auth: "API Key",
    status: "지원종료",
    tags: ["스크래핑", "레거시"],
    version: "v0",
    updated: "2025-11-01T00:00:00.000Z",
    url: "#",
  },
];

// --- 상세 본문 블록 빌더 (Notion 블록 형태를 흉내낸 최소 구조, 렌더러 호환) ---

let seq = 0;
const nextId = () => `sb-${(seq += 1)}`;

function rt(content: string) {
  return [
    {
      type: "text",
      text: { content, link: null },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: "default",
      },
      plain_text: content,
      href: null,
    },
  ];
}

function heading(text: string) {
  return {
    object: "block",
    id: nextId(),
    type: "heading_2",
    has_children: false,
    children: [],
    heading_2: { rich_text: rt(text), color: "default", is_toggleable: false },
  };
}

function paragraph(text: string) {
  return {
    object: "block",
    id: nextId(),
    type: "paragraph",
    has_children: false,
    children: [],
    paragraph: { rich_text: rt(text), color: "default" },
  };
}

function code(content: string, language = "json") {
  return {
    object: "block",
    id: nextId(),
    type: "code",
    has_children: false,
    children: [],
    code: { rich_text: rt(content), caption: [], language },
  };
}

function tableRow(cells: string[]) {
  return {
    object: "block",
    id: nextId(),
    type: "table_row",
    has_children: false,
    children: [],
    table_row: { cells: cells.map((c) => rt(c)) },
  };
}

function paramTable(rows: string[][]) {
  return {
    object: "block",
    id: nextId(),
    type: "table",
    has_children: true,
    table: { table_width: 3, has_column_header: true, has_row_header: false },
    children: [tableRow(["파라미터", "타입", "설명"]), ...rows.map(tableRow)],
  };
}

/** 항목별 상세 본문 블록 생성. */
export function sampleBlocks(item: ApiItem): BlockWithChildren[] {
  const blocks = [
    heading("개요"),
    paragraph(
      `${item.name} API입니다. ${item.method} ${item.endpoint} 로 호출하며 인증은 ${item.auth} 방식을 사용합니다.`,
    ),
    heading("파라미터"),
    paramTable([
      ["id", "string", "리소스 식별자 (경로 파라미터)"],
      ["Authorization", "header", `${item.auth} 토큰`],
    ]),
    heading("요청 예시"),
    code(`${item.method} ${item.endpoint}\nAuthorization: Bearer <token>`, "bash"),
    heading("응답 예시"),
    code(
      JSON.stringify({ code: "0000", message: "success", data: {} }, null, 2),
      "json",
    ),
  ];
  return blocks as unknown as BlockWithChildren[];
}
