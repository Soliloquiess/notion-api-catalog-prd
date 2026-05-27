import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { MethodBadge } from "@/components/method-badge";
import { StatusBadge } from "@/components/status-badge";
import { NotionBlocks } from "@/components/notion-blocks";
import { fetchApiById, fetchApis } from "@/lib/notion";

// ISR: 5분마다 재생성. 새 항목은 dynamicParams(기본 true)로 요청 시 생성·캐시.
export const revalidate = 300;

/** 목록의 ID들로 정적 생성. 키 미설정 시 빈 배열 → 요청 시 동적 렌더(dynamicParams 기본 true). */
export async function generateStaticParams() {
  const apis = await fetchApis();
  return apis.map((item) => ({ id: item.id }));
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm">
      <dt className="w-20 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

export default async function ApiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await fetchApiById(id);
  if (!detail) notFound();

  const { item, blocks } = detail;
  const updated = formatDate(item.updated);

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        목록으로
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <MethodBadge method={item.method} />
          <StatusBadge status={item.status} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{item.name}</h1>
        {item.endpoint && (
          <code className="block w-fit rounded bg-muted px-2 py-1 font-mono text-sm">
            {item.endpoint}
          </code>
        )}
        <dl className="grid gap-1.5 pt-2 sm:grid-cols-2">
          <MetaRow label="제공처" value={item.provider} />
          <MetaRow label="인증" value={item.auth} />
          <MetaRow label="카테고리" value={item.category} />
          <MetaRow label="버전" value={item.version} />
          <MetaRow label="수정" value={updated} />
        </dl>
        {item.tags.length > 0 && (
          <p className="text-sm text-muted-foreground">
            태그: {item.tags.join(", ")}
          </p>
        )}
      </header>

      <hr className="border-border" />

      <div className="text-[0.95rem]">
        {blocks.length > 0 ? (
          <NotionBlocks blocks={blocks} />
        ) : (
          <p className="text-muted-foreground">상세 본문이 비어 있습니다.</p>
        )}
      </div>
    </article>
  );
}
