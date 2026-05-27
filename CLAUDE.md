# API 연동 카탈로그

Notion을 CMS로 활용해, API 연동 명세를 검색·필터 가능한 웹 카탈로그로 제공하는 프로젝트.
현재는 기획 단계(PRD/ROADMAP)이며, 구현은 ROADMAP의 Phase 순서대로 진행한다.

# Project Context
- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

# 개발 원칙
- 구현 순서는 ROADMAP을 따른다: **골격 → 공통 → 개별 기능** (기능부터 만들지 않는다)
- 공통 데이터 레이어(`lib/notion.ts`)와 타입(`types/api.ts`)을 먼저 만들고, 화면은 그 위에 올린다
- Notion API 키(`NOTION_API_KEY`, `NOTION_DATABASE_ID`)는 **서버 전용**, 클라이언트 번들에 노출 금지
- 계획 스택: Next.js 15(App Router) + TypeScript + Tailwind + shadcn/ui + Lucide
