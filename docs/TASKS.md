# TASKS — API 연동 카탈로그

> [`docs/ROADMAP.md`](ROADMAP.md)의 5단계를 **실제 작업 단위**로 분해한 체크리스트.
> 순서 원칙: **골격 → 공통 → 개별 기능**. 위에서부터 순서대로 진행한다.
> 각 작업은 `[ ]`(예정) / `[~]`(진행중) / `[x]`(완료)로 표시한다.

## 진행 현황
- 총 작업: 18개 / 완료 4
- 현재 단계: Phase 2 시작 전 (Phase 1 골격 완료)

---

## Phase 1 — 프로젝트 초기 설정 (골격)
선행: 없음

- [x] **T1.1** Next.js 16 (App Router) + TypeScript 프로젝트 생성
- [x] **T1.2** Tailwind CSS + shadcn/ui + Lucide React 설치·초기화
- [x] **T1.3** `@notionhq/client` 설치, `.env.local`에 `NOTION_API_KEY`·`NOTION_DATABASE_ID` 구성 (서버 전용)
- [x] **T1.4** 기본 레이아웃(`app/layout.tsx`): 상단 네비 + 다크모드 토글 + 푸터

**완료 기준**: `npm run dev`로 빈 레이아웃이 뜨고 다크모드 토글 동작, 환경 변수 로딩 구조 확립

---

## Phase 2 — 공통 모듈/컴포넌트 (공통)
선행: Phase 1
> 모든 화면이 같은 조회 함수·타입·뱃지를 재사용하므로, 이 단계를 먼저 끝내야 중복이 안 생긴다.

- [ ] **T2.1** `lib/notion.ts`: Notion 클라이언트 초기화 + `fetchApis()`(목록 조회)
- [ ] **T2.2** `lib/notion.ts`: `fetchApiById(id)`(상세 + 본문 블록 조회), 에러/빈값 처리
- [ ] **T2.3** `types/api.ts`: Notion 속성(Name/Category/Method/Endpoint/Provider/Auth/Status/Tags/Version/Updated) → `ApiItem` 매핑 함수 (단일 지점)
- [ ] **T2.4** 공통 UI: `ApiCard`, `Badge`(메서드·상태용)
- [ ] **T2.5** 공통 UI: `SearchInput`, `FilterSelect`
- [ ] **T2.6** 공통 UI: `Header`, `Footer` + 공통 유틸(메서드 색상, 상태 라벨)

**완료 기준**: `fetchApis()`가 실제 Notion DB에서 `ApiItem[]` 반환, `ApiCard`에 데이터 넣으면 정상 렌더링

---

## Phase 3 — 핵심 기능 (개별 기능)
선행: Phase 2

- [ ] **T3.1** API 목록 페이지(`app/page.tsx`): `fetchApis()` 결과를 `ApiCard` 그리드로 표시
- [ ] **T3.2** API 상세 페이지(`app/apis/[id]/page.tsx`): 메서드·엔드포인트·상태 뱃지 헤더
- [ ] **T3.3** 상세 본문: Notion 블록(문단·코드블록·표) → React 렌더링

**완료 기준**: 목록 카드 클릭 → 상세 이동, 상세에서 엔드포인트·인증·파라미터·예시 확인 가능

---

## Phase 4 — 추가 기능 (개별 기능)
선행: Phase 2, Phase 3

- [ ] **T4.1** 검색: 이름·엔드포인트·태그 키워드 필터
- [ ] **T4.2** 필터: 카테고리 / HTTP 메서드 / 상태(운영·베타·지원종료)
- [ ] **T4.3** 카테고리별 페이지(`app/category/[name]/page.tsx`)

**완료 기준**: 검색과 3종 필터 동시 동작, 카테고리 페이지가 해당 항목만 표시

---

## Phase 5 — 최적화 및 배포
선행: Phase 1~4

- [ ] **T5.1** ISR `revalidate` 설정 (Notion 변경 자동 반영) + rate limit 대비 캐싱 점검
- [ ] **T5.2** 반응형/다크모드 마감, 접근성(키보드 조작·텍스트 뱃지 병행)
- [ ] **T5.3** Vercel 배포 + 환경 변수 설정

**완료 기준**: 배포 URL 접속 가능, Notion 항목 추가 시 재검증 주기 내 반영, 모바일 레이아웃 정상

---

## 의존성 요약
```
Phase 1 (T1.1~T1.4)
   └─> Phase 2 (T2.1~T2.6)
          ├─> Phase 3 (T3.1~T3.3)
          │        └─> Phase 4 (T4.1~T4.3)
          └────────────────────────┘
                     └─> Phase 5 (T5.1~T5.3)
```
