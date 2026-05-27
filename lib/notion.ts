import "server-only";

import { Client, isFullBlock, isFullPage } from "@notionhq/client";
import type { BlockObjectResponse } from "@notionhq/client";

import { mapPageToApiItem, type ApiItem } from "@/types/api";

/**
 * Notion 데이터 레이어 — 모든 Notion 호출은 이 파일에 모은다.
 * NOTION_API_KEY / NOTION_DATABASE_ID 는 서버 전용이며 `server-only`로 클라이언트 번들 노출을 차단한다.
 *
 * 주의(@notionhq/client v5): `databases.query`가 제거되고 `dataSources.query`로 대체됐다.
 * 따라서 NOTION_DATABASE_ID로 데이터베이스를 조회해 (첫) 데이터 소스 ID를 한 번 해석한 뒤 캐시한다.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `환경 변수 ${name} 가 설정되지 않았습니다. .env.local 을 확인하세요.`,
    );
  }
  return value;
}

let client: Client | null = null;
function getClient(): Client {
  if (!client) client = new Client({ auth: requireEnv("NOTION_API_KEY") });
  return client;
}

let dataSourceId: string | null = null;
async function getDataSourceId(): Promise<string> {
  if (dataSourceId) return dataSourceId;
  const db = await getClient().databases.retrieve({
    database_id: requireEnv("NOTION_DATABASE_ID"),
  });
  const sources = "data_sources" in db ? db.data_sources : [];
  const first = sources[0];
  if (!first) {
    throw new Error("데이터베이스에서 데이터 소스를 찾지 못했습니다.");
  }
  dataSourceId = first.id;
  return first.id;
}

/** API 목록 조회. 실패 시 빈 배열을 반환해 화면이 깨지지 않게 한다. */
export async function fetchApis(): Promise<ApiItem[]> {
  try {
    const source = await getDataSourceId();
    const items: ApiItem[] = [];
    let cursor: string | undefined;
    do {
      const res = await getClient().dataSources.query({
        data_source_id: source,
        start_cursor: cursor,
        page_size: 100,
      });
      for (const row of res.results) {
        if (isFullPage(row)) items.push(mapPageToApiItem(row));
      }
      cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
    } while (cursor);
    return items;
  } catch (error) {
    console.error("[notion] fetchApis 실패:", error);
    return [];
  }
}

/** 블록 + (있으면) 재귀적으로 조회한 자식 블록. 표/리스트/토글 등 중첩 콘텐츠 렌더링에 사용. */
export type BlockWithChildren = BlockObjectResponse & {
  children: BlockWithChildren[];
};

export interface ApiDetail {
  item: ApiItem;
  blocks: BlockWithChildren[];
}

/** 단일 API 상세 + 본문 블록 조회. 없거나 실패하면 null. */
export async function fetchApiById(id: string): Promise<ApiDetail | null> {
  try {
    const page = await getClient().pages.retrieve({ page_id: id });
    if (!isFullPage(page)) return null;
    const blocks = await fetchBlocks(id);
    return { item: mapPageToApiItem(page), blocks };
  } catch (error) {
    console.error(`[notion] fetchApiById(${id}) 실패:`, error);
    return null;
  }
}

/** 블록 children 전체 조회(페이지네이션 + has_children 재귀). */
async function fetchBlocks(blockId: string): Promise<BlockWithChildren[]> {
  const blocks: BlockWithChildren[] = [];
  let cursor: string | undefined;
  do {
    const res = await getClient().blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const block of res.results) {
      if (!isFullBlock(block)) continue;
      const children = block.has_children ? await fetchBlocks(block.id) : [];
      blocks.push({ ...block, children });
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return blocks;
}
