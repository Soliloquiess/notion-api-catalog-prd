import { Fragment, type ReactNode } from "react";
import type { RichTextItemResponse } from "@notionhq/client";

import type { BlockWithChildren } from "@/lib/notion";
import { cn } from "@/lib/utils";

/** Notion rich_text 배열을 주석(굵게/기울임/코드/링크 등)과 함께 렌더한다. */
function RichText({ value }: { value: RichTextItemResponse[] }) {
  if (!value?.length) return null;
  return (
    <>
      {value.map((rt, index) => {
        const { annotations, plain_text, href } = rt;
        let node: ReactNode = plain_text;
        if (annotations.code) {
          node = (
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
              {node}
            </code>
          );
        }
        if (annotations.bold) node = <strong>{node}</strong>;
        if (annotations.italic) node = <em>{node}</em>;
        if (annotations.strikethrough) node = <s>{node}</s>;
        if (annotations.underline) node = <u>{node}</u>;
        if (href) {
          node = (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              {node}
            </a>
          );
        }
        return <Fragment key={index}>{node}</Fragment>;
      })}
    </>
  );
}

/** 단일 블록 렌더. 리스트는 NotionBlocks에서 그룹으로 묶으므로 list item 자체는 <li>만 그린다. */
function Block({ block }: { block: BlockWithChildren }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="my-3 leading-7">
          <RichText value={block.paragraph.rich_text} />
        </p>
      );
    case "heading_1":
      return (
        <h2 className="mt-8 mb-3 text-xl font-semibold tracking-tight">
          <RichText value={block.heading_1.rich_text} />
        </h2>
      );
    case "heading_2":
      return (
        <h3 className="mt-6 mb-2 text-lg font-semibold tracking-tight">
          <RichText value={block.heading_2.rich_text} />
        </h3>
      );
    case "heading_3":
      return (
        <h4 className="mt-4 mb-2 text-base font-semibold">
          <RichText value={block.heading_3.rich_text} />
        </h4>
      );
    case "code":
      return (
        <pre className="my-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code className="font-mono" data-language={block.code.language}>
            {block.code.rich_text.map((rt) => rt.plain_text).join("")}
          </code>
        </pre>
      );
    case "quote":
      return (
        <blockquote className="my-4 border-l-2 border-border pl-4 text-muted-foreground italic">
          <RichText value={block.quote.rich_text} />
          {block.children.length > 0 && <NotionBlocks blocks={block.children} />}
        </blockquote>
      );
    case "callout":
      return (
        <div className="my-4 flex gap-2 rounded-lg border bg-muted/50 p-3">
          {block.callout.icon?.type === "emoji" && (
            <span aria-hidden>{block.callout.icon.emoji}</span>
          )}
          <div>
            <RichText value={block.callout.rich_text} />
            {block.children.length > 0 && (
              <NotionBlocks blocks={block.children} />
            )}
          </div>
        </div>
      );
    case "to_do":
      return (
        <div className="my-1 flex items-start gap-2">
          <input
            type="checkbox"
            checked={block.to_do.checked}
            readOnly
            className="mt-1.5"
            aria-label="할 일"
          />
          <span className={cn(block.to_do.checked && "text-muted-foreground line-through")}>
            <RichText value={block.to_do.rich_text} />
          </span>
        </div>
      );
    case "toggle":
      return (
        <details className="my-3 rounded-lg border p-3">
          <summary className="cursor-pointer font-medium">
            <RichText value={block.toggle.rich_text} />
          </summary>
          {block.children.length > 0 && (
            <div className="mt-2">
              <NotionBlocks blocks={block.children} />
            </div>
          )}
        </details>
      );
    case "divider":
      return <hr className="my-6 border-border" />;
    case "table":
      return <NotionTable block={block} />;
    case "image": {
      const src =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      const caption = block.image.caption;
      return (
        <figure className="my-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={caption.map((c) => c.plain_text).join("") || ""} className="rounded-lg" />
          {caption.length > 0 && (
            <figcaption className="mt-1 text-center text-sm text-muted-foreground">
              <RichText value={caption} />
            </figcaption>
          )}
        </figure>
      );
    }
    case "column_list":
      return (
        <div className="my-4 flex flex-col gap-4 sm:flex-row">
          {block.children.map((col) => (
            <div key={col.id} className="flex-1">
              <NotionBlocks blocks={col.children} />
            </div>
          ))}
        </div>
      );
    default:
      // 미지원 블록: 자식이 있으면 자식만 렌더(컨테이너성 블록 대비), 없으면 무시.
      return block.children.length > 0 ? (
        <NotionBlocks blocks={block.children} />
      ) : null;
  }
}

/** 표 블록 렌더. 첫 행을 헤더로 처리할지는 table.has_column_header를 따른다. */
function NotionTable({ block }: { block: BlockWithChildren }) {
  if (block.type !== "table") return null;
  const rows = block.children.filter(
    (child): child is BlockWithChildren & { type: "table_row" } =>
      child.type === "table_row",
  );
  if (rows.length === 0) return null;
  const hasHeader = block.table.has_column_header;
  const [headerRow, ...bodyRows] = hasHeader ? rows : [];
  const dataRows = hasHeader ? bodyRows : rows;

  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {headerRow && (
          <thead>
            <tr className="border-b">
              {headerRow.table_row.cells.map((cell, i) => (
                <th key={i} className="px-3 py-2 text-left font-semibold">
                  <RichText value={cell} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {dataRows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.table_row.cells.map((cell, i) => (
                <td key={i} className="px-3 py-2 align-top">
                  <RichText value={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 블록 배열 렌더. 연속된 같은 종류의 리스트 항목은 <ul>/<ol>로 묶는다. */
export function NotionBlocks({ blocks }: { blocks: BlockWithChildren[] }) {
  const out: ReactNode[] = [];

  for (let i = 0; i < blocks.length; ) {
    const type = blocks[i].type;

    if (type === "bulleted_list_item" || type === "numbered_list_item") {
      const group: BlockWithChildren[] = [];
      while (i < blocks.length && blocks[i].type === type) {
        group.push(blocks[i]);
        i += 1;
      }
      const ordered = type === "numbered_list_item";
      const ListTag = ordered ? "ol" : "ul";
      out.push(
        <ListTag
          key={group[0].id}
          className={cn(
            "my-3 ml-6 space-y-1",
            ordered ? "list-decimal" : "list-disc",
          )}
        >
          {group.map((item) => {
            const rich =
              item.type === "numbered_list_item"
                ? item.numbered_list_item.rich_text
                : item.type === "bulleted_list_item"
                  ? item.bulleted_list_item.rich_text
                  : [];
            return (
              <li key={item.id}>
                <RichText value={rich} />
                {item.children.length > 0 && (
                  <NotionBlocks blocks={item.children} />
                )}
              </li>
            );
          })}
        </ListTag>,
      );
      continue;
    }

    out.push(<Block key={blocks[i].id} block={blocks[i]} />);
    i += 1;
  }

  return <>{out}</>;
}
