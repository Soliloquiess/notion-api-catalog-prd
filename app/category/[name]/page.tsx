import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ApiCatalog } from "@/components/api-catalog";
import { fetchApis } from "@/lib/notion";

// ISR: 5분마다 재생성.
export const revalidate = 300;

/** 데이터에 존재하는 카테고리들로 정적 생성. */
export async function generateStaticParams() {
  const apis = await fetchApis();
  const categories = Array.from(
    new Set(apis.map((item) => item.category).filter(Boolean)),
  );
  return categories.map((name) => ({ name: encodeURIComponent(name) }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const category = decodeURIComponent(name);
  const apis = await fetchApis();
  const items = apis.filter((item) => item.category === category);

  return (
    <section className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        전체 목록으로
      </Link>

      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">카테고리</p>
        <h1 className="text-2xl font-semibold tracking-tight">{category}</h1>
      </header>

      {items.length > 0 ? (
        <ApiCatalog items={items} hideCategoryFilter />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          이 카테고리에 해당하는 API가 없습니다.
        </div>
      )}
    </section>
  );
}
