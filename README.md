# API 연동 카탈로그 (API Catalog Hub)

> Notion을 CMS로 활용해, 사내/팀의 API 연동 명세를 **검색·필터 가능한 웹 카탈로그**로 제공하는 프로젝트.
> 비개발자도 Notion에서 API 정보를 추가/수정하면 사이트에 자동 반영됩니다(ISR).

현재 단계: **MVP 구현 완료** (Phase 1~5). 진행 내역은 [`docs/TASKS.md`](docs/TASKS.md), 기획은 [`docs/PRD.md`](docs/PRD.md) 참고.

## 기술 스택

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **CMS**: Notion API (`@notionhq/client` v5 — `dataSources.query`)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Icons**: Lucide React
- **다크모드**: next-themes (class 기반)
- **배포**: Vercel (ISR `revalidate` 5분으로 Notion 변경 자동 반영)

## 주요 기능 (MVP)

- Notion 데이터베이스 기반 API 목록 조회 (`/`)
- 이름·엔드포인트·태그 검색
- 카테고리 / HTTP 메서드 / 상태 필터
- API 상세 페이지 (`/apis/[id]`) — 헤더 뱃지 + Notion 본문 블록 렌더링
- 카테고리별 페이지 (`/category/[name]`)
- 반응형 + 다크모드 + 접근성(키보드 조작·텍스트 뱃지 병행)

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # 값 채우기 (아래 참고)
npm run dev                  # http://localhost:3000
npm run build && npm start   # 프로덕션 빌드/실행
npm run lint
```

## 환경 변수

```
NOTION_API_KEY=...        # Notion 통합(Integration) 시크릿
NOTION_DATABASE_ID=...    # APIs 데이터베이스 ID
```

> 🔒 두 값은 **서버 전용**입니다. `lib/notion.ts`는 `server-only`로 보호되며 클라이언트 번들에 포함되지 않습니다. `.env.local`은 커밋하지 않습니다(`.gitignore` 처리됨).

> 🧪 **샘플 모드**: `NOTION_API_KEY`가 없으면 `lib/sample-data.ts`의 데모 데이터로 동작합니다(목록·상세·검색·필터 모두 작동). 키를 넣으면 자동으로 실제 Notion 데이터로 전환됩니다.

### Notion 준비

1. https://www.notion.so/my-integrations 에서 통합(Integration) 생성 → **시크릿**을 `NOTION_API_KEY`에.
2. `APIs` 데이터베이스 생성(필드: Name/Category/Method/Endpoint/Provider/Auth/Status/Tags/Version/Updated — [PRD §4](docs/PRD.md) 참고).
3. 데이터베이스 우상단 `...` → **연결(Connections)** 에서 위 통합을 추가(공유).
4. 데이터베이스 URL의 ID(32자)를 `NOTION_DATABASE_ID`에. (코드가 이 ID로 데이터 소스를 자동 해석)

## Vercel 배포

1. 저장소를 GitHub에 push.
2. [vercel.com](https://vercel.com) → New Project → 저장소 import (프레임워크 자동 감지: Next.js).
3. **Environment Variables** 에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 추가 (서버 전용).
4. Deploy. 이후 Notion에서 항목을 추가/수정하면 **최대 5분(ISR revalidate)** 내 사이트에 반영됩니다.

> CLI로도 가능: `npx vercel`(연결) → `npx vercel --prod`. 환경 변수는 대시보드 또는 `vercel env add`로 주입.

## 문서

- [`docs/PRD.md`](docs/PRD.md) — 제품 요구사항 정의서
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — 개발 로드맵(Phase별 순서·이유)
- [`docs/TASKS.md`](docs/TASKS.md) — 작업 체크리스트(T1.1~T5.3)
