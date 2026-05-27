import { ApiCatalog } from "@/components/api-catalog";
import { fetchApis } from "@/lib/notion";

// ISR: 5분마다 재생성해 Notion 변경을 반영(rate limit 대비 호출 최소화).
export const revalidate = 300;

export default async function Home() {
  const apis = await fetchApis();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">API 연동 카탈로그</h1>
        <p className="text-muted-foreground">
          이름·엔드포인트·태그로 검색하고 카테고리·메서드·상태로 필터링하세요.
        </p>
      </header>

      {apis.length > 0 ? (
        <ApiCatalog items={apis} />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Notion 데이터베이스에서 항목을 불러오지 못했습니다.
          <br />
          <code className="font-mono">.env.local</code> 의{" "}
          <code className="font-mono">NOTION_API_KEY</code> ·{" "}
          <code className="font-mono">NOTION_DATABASE_ID</code> 설정과 통합 공유를
          확인하세요.
        </div>
      )}
    </section>
  );
}
