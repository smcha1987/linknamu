"use client";

import { useEffect, useState } from "react";
import { memoColorKeys, memoColors, type Memo } from "@/data/memoColors";
import MemoForm, { type MemoDraft } from "./MemoForm";

// 포스트잇처럼 보이도록 카드마다 살짝 다른 기울기
const tilts = ["-rotate-1", "rotate-1", "rotate-0", "rotate-1", "-rotate-1", "rotate-0"];

export default function MemoBoard() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [draft, setDraft] = useState<MemoDraft | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/memos", { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setMemos(await res.json());
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("[memo] failed to load memos", error);
        setStatus("error");
      }
    })();
    return () => controller.abort();
  }, [reloadKey]);

  // 새 메모 색상은 목록 순서대로 돌아가며 지정
  const nextColor = memoColorKeys[memos.length % memoColorKeys.length];

  return (
    <>
      <section
        aria-labelledby="memo-board-title"
        className="rounded-3xl border-2 border-foreground/80 bg-surface-strong p-5 shadow-sm sm:p-8"
      >
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h2 id="memo-board-title" className="text-lg font-bold">
            memo 모음
          </h2>
          <span className="text-sm text-muted">
            {status === "loading" && "불러오는 중…"}
            {status === "ready" && `${memos.length}개`}
            {status === "error" && (
              <span className="text-red-500">
                메모를 불러오지 못했어요.{" "}
                <button type="button" className="underline" onClick={() => setReloadKey((k) => k + 1)}>
                  다시 시도
                </button>
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => setDraft({ color: nextColor })}
            className="ml-auto rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/25 transition hover:brightness-105"
          >
            + 메모 추가
          </button>
        </div>

        {status === "ready" && memos.length === 0 ? (
          <p className="py-16 text-center text-muted">아직 메모가 없어요. 첫 메모를 추가해 보세요!</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
            {memos.map((memo, i) => (
              <li key={memo.id}>
                <button
                  type="button"
                  onClick={() => setDraft(memo)}
                  className={`flex aspect-square w-full flex-col gap-2 overflow-hidden rounded-2xl border-2 border-black/70 p-4 text-left shadow-md transition hover:z-10 hover:scale-105 hover:rotate-0 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${memoColors[memo.color].card} ${tilts[i % tilts.length]}`}
                >
                  {memo.title && <span className="line-clamp-2 break-keep font-bold">{memo.title}</span>}
                  <span className="line-clamp-5 whitespace-pre-line break-keep text-sm opacity-80">{memo.content}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {draft && (
        <MemoForm
          key={"id" in draft ? draft.id : "new"}
          draft={draft}
          onClose={() => setDraft(null)}
          onSaved={() => {
            setDraft(null);
            setReloadKey((k) => k + 1);
          }}
        />
      )}
    </>
  );
}
