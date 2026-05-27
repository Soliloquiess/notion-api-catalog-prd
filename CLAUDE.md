# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# API 연동 카탈로그

Notion을 CMS로 활용해, API 연동 명세를 검색·필터 가능한 웹 카탈로그로 제공하는 프로젝트.

## 현재 상태 (중요)
**Phase 1(골격) 완료** — Next.js 16 App Router + TypeScript + Tailwind v4 + shadcn/ui + Lucide + `@notionhq/client`가 셋업됐고, 기본 레이아웃(Header 네비·다크모드 토글·Footer)·환경 변수 구조(`.env.local`/`.env.example`)가 잡혀 있다.
다음은 **Phase 2(공통)**: `lib/notion.ts`(데이터 레이어)·`types/api.ts`(단일 매퍼)·공통 컴포넌트. 구현은 ROADMAP의 Phase 순서대로 진행한다.

# Project Context
- 제품 요구사항: @docs/PRD.md
- 개발 로드맵(Phase별 순서·이유): @docs/ROADMAP.md
- 작업 체크리스트(18개 작업, T1.1~T5.3): @docs/TASKS.md — 작업 진행 시 `[ ]`/`[~]`/`[x]`로 상태 갱신

# 아키텍처의 핵심 (여러 파일을 봐야 보이는 큰 그림)
모든 화면(목록·상세·검색·필터·카테고리)이 **단 하나의 조회 함수·타입·매퍼를 공유**하는 구조다. 이것이 순서 결정의 근거다.

- **데이터 레이어** `lib/notion.ts` — `@notionhq/client` 초기화, `fetchApis()`(목록), `fetchApiById(id)`(상세+본문 블록). Notion 호출은 전부 여기로 모은다.
- **타입 매핑** `types/api.ts` — Notion 속성(Name/Category/Method/Endpoint/Provider/Auth/Status/Tags/Version/Updated) → 앱 타입 `ApiItem`으로 변환하는 **단일 매퍼**. Notion 스키마가 바뀌면 이 한 곳만 고친다.
- 화면(`app/page.tsx`, `app/apis/[id]/page.tsx`, `app/category/[name]/page.tsx`)은 위 두 모듈 위에 올린다. 페이지마다 Notion 파싱 코드를 중복시키지 않는다.
- 데이터는 **서버 컴포넌트에서 페칭**, 검색·필터는 받은 `ApiItem[]`을 클라이언트에서 거른다. ISR `revalidate`로 Notion 변경을 주기 반영한다.

# 개발 원칙
- 구현 순서는 ROADMAP을 따른다: **골격 → 공통 → 개별 기능** (기능부터 만들지 않는다)
- 공통 데이터 레이어·타입을 먼저 만들고, 화면은 그 위에 올린다 (위 "아키텍처의 핵심" 참고)
- Notion API 키(`NOTION_API_KEY`, `NOTION_DATABASE_ID`)는 **서버 전용**. 클라이언트 번들 노출 금지, `.env*.local`은 커밋하지 않는다(`.gitignore` 처리됨)
- 색만으로 정보를 전달하지 않는다 — 메서드/상태는 텍스트 뱃지를 병행한다(접근성)

# 스택 / 명령어
스택: Next.js 16(App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Lucide React + `@notionhq/client`, 배포는 Vercel(ISR).
명령어: `npm run dev`(Turbopack) / `npm run build` / `npm run lint`. 다크모드는 `next-themes`(class 기반, html `.dark`)로 동작한다.

# 도구 메모
- Shrimp Task Manager MCP가 **활성화**돼 있고, 5-Phase 작업 계획(골격→공통→개별 기능)이 등록돼 있다(데이터: `shrimp_data/`). 작업 계획·상태의 정식 저장소는 Shrimp이며, `docs/TASKS.md`(T1.1~T5.3)는 사람이 읽는 체크리스트로 병행 갱신한다.
- MCP 서버는 세션 시작 시점에만 로드된다 — 세션 중 settings를 켜도 재시작/`/mcp` 재연결 전에는 도구가 들어오지 않는다.
