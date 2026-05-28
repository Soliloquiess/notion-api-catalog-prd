"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

/** 텍스트를 클립보드에 복사하는 버튼. 복사 후 잠시 체크 아이콘을 보여준다. */
export function CopyButton({
  value,
  className,
  label = "복사",
}: {
  value: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 접근 불가 환경은 조용히 무시
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className={className}
      aria-label={copied ? "복사됨" : `${label} (클립보드에 복사)`}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="text-emerald-600 dark:text-emerald-400" aria-hidden />
      ) : (
        <Copy aria-hidden />
      )}
    </Button>
  );
}
