"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/Modal";
import { memoColorKeys, memoColors, type Memo, type MemoColor } from "@/data/memoColors";

// 새 메모는 기본 색상만, 수정은 기존 메모 전체를 받음
export type MemoDraft = { color: MemoColor } | Memo;

type MemoFormProps = {
  draft: MemoDraft;
  onClose: () => void;
  onSaved: () => void;
};

const inputClass =
  "w-full rounded-xl border border-line bg-surface-strong px-3 py-2.5 text-[15px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25";

export default function MemoForm({ draft, onClose, onSaved }: MemoFormProps) {
  const editing = "id" in draft ? draft : null;
  const [title, setTitle] = useState(editing?.title ?? "");
  const [content, setContent] = useState(editing?.content ?? "");
  const [color, setColor] = useState<MemoColor>(draft.color);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(method: "POST" | "PATCH" | "DELETE", body?: object) {
    setPending(true);
    setError(null);
    try {
      const url = editing ? `/api/memos/${editing.id}` : "/api/memos";
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body && JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `요청 실패 (HTTP ${res.status})`);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "요청에 실패했어요");
      setPending(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(editing ? "PATCH" : "POST", { title, content, color });
  }

  function handleDelete() {
    if (confirm(`"${editing?.title || "제목 없음"}" 메모를 삭제할까요?`)) send("DELETE");
  }

  return (
    <Modal open onClose={onClose} title={editing ? "메모 상세" : "새 메모"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          제목
          <input
            type="text"
            maxLength={50}
            autoFocus={!editing}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: memo 1"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          내용
          <textarea
            rows={10}
            maxLength={2000}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="예: it 공부 추천교재"
            className={`${inputClass} resize-y ${memoColors[color].card}`}
          />
        </label>
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-semibold">색상</legend>
          <div className="flex flex-wrap gap-2">
            {memoColorKeys.map((key) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface-strong px-3 py-1.5 text-sm transition has-checked:border-accent has-checked:ring-2 has-checked:ring-accent/25 has-focus-visible:outline-2 has-focus-visible:outline-accent"
              >
                <input
                  type="radio"
                  name="color"
                  value={key}
                  checked={color === key}
                  onChange={() => setColor(key)}
                  className="sr-only"
                />
                <span aria-hidden="true" className={`h-3 w-3 rounded-full border border-black/20 ${memoColors[key].dot}`} />
                {memoColors[key].label}
              </label>
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          {editing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
            >
              삭제
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-muted transition hover:text-foreground"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={pending || (!title.trim() && !content.trim())}
            className="rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/25 transition hover:brightness-105 disabled:opacity-60"
          >
            {pending ? "저장 중…" : "저장"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
