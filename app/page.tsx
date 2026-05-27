import { ApiCard } from "@/components/api-card";
import { fetchApis } from "@/lib/notion";

export default async function Home() {
  const apis = await fetchApis();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">API 연동 카탈로그</h1>
        <p className="text-muted-foreground">
          {apis.length > 0
            ? `총 ${apis.length}개의 API`
            : "표시할 API가 없습니다."}
        </p>
      </header>

      {apis.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apis.map((item) => (
            <ApiCard key={item.id} item={item} />
          ))}
        </div>
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
