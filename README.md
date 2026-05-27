# API 연동 카탈로그 (API Catalog Hub)

> Notion을 CMS로 활용해, 사내/팀의 API 연동 명세를 **검색·필터 가능한 웹 카탈로그**로 제공하는 프로젝트.
> 비개발자도 Notion에서 API 정보를 추가/수정하면 사이트에 자동 반영됩니다.

현재 단계: **PRD 작성 완료** — 구현은 다음 단계에서 진행합니다.
상세 기획은 [`docs/PRD.md`](docs/PRD.md) 참고.

## 기술 스택 (예정)

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **CMS**: Notion API (`@notionhq/client`)
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **배포**: Vercel (ISR로 Notion 변경 자동 반영)

## 주요 기능 (MVP)

- Notion 데이터베이스 기반 API 목록 조회
- 이름·엔드포인트·태그 검색
- 카테고리 / HTTP 메서드 / 상태 필터
- API 상세 페이지 (엔드포인트·인증·파라미터·예시)
- 반응형 + 다크모드

## 환경 변수 (구현 시)

```
NOTION_API_KEY=...        # Notion 통합(Integration) 시크릿
NOTION_DATABASE_ID=...    # APIs 데이터베이스 ID
```

> 🔒 두 값은 **서버 전용**입니다. `.env.local`은 커밋하지 않습니다(`.gitignore` 처리됨).

## 문서

- [`docs/PRD.md`](docs/PRD.md) — 제품 요구사항 정의서
