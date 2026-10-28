import type { Metadata } from "next";
import Link from "next/link";
import MemoBoard from "@/components/memo/MemoBoard";

export const metadata: Metadata = {
  title: "중요 메모 작성",
  description: "중요 메모를 포스트잇처럼 모아 관리해요.",
};

export default function MemoPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:py-10">
      <header className="flex flex-col gap-3">
        <Link
          href="/"
          className="w-fit rounded-full border border-line bg-surface px-3 py-1 text-sm text-muted backdrop-blur-md transition hover:text-foreground"
        >
          ← 돌아가기
        </Link>
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-emerald-500 to-cyan-500 text-xl shadow-lg shadow-emerald-500/25"
          >
            💻
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">중요 메모 작성</h1>
            <p className="text-sm text-muted">메모를 눌러 자세히 보고 수정·삭제하세요.</p>
          </div>
        </div>
      </header>
      <MemoBoard />
    </main>
  );
}
