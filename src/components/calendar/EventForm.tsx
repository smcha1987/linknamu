"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/Modal";
import { categoryKeys, eventCategories, type CalendarEvent, type EventCategory } from "@/data/eventCategories";

// 새 일정은 날짜만, 수정은 기존 일정 전체를 받음
export type EventDraft = { date: string } | CalendarEvent;

type EventFormProps = {
  draft: EventDraft;
  onClose: () => void;
  onSaved: () => void;
};

const inputClass =
  "w-full rounded-xl border border-line bg-surface-strong px-3 py-2.5 text-[15px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25";

export default function EventForm({ draft, onClose, onSaved }: EventFormProps) {
  const editing = "id" in draft ? draft : null;
  const [date, setDate] = useState(draft.date);
  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState<EventCategory>(editing?.category ?? "schedule");
  const [memo, setMemo] = useState(editing?.memo ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(method: "POST" | "PATCH" | "DELETE", body?: object) {
    setPending(true);
    setError(null);
    try {
      const url = editing ? `/api/events/${editing.id}` : "/api/events";
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
    send(editing ? "PATCH" : "POST", { date, title, category, memo });
  }

  function handleDelete() {
    if (confirm(`"${editing?.title}" 일정을 삭제할까요?`)) send("DELETE");
  }

  return (
    <Modal open onClose={onClose} title={editing ? "일정 수정" : "새 일정"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          날짜
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          제목
          <input
            type="text"
            required
            maxLength={50}
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 아영이 소아과 진료"
            className={inputClass}
          />
        </label>
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-semibold">분류</legend>
          <div className="flex flex-wrap gap-2">
            {categoryKeys.map((key) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface-strong px-3 py-1.5 text-sm transition has-checked:border-accent has-checked:ring-2 has-checked:ring-accent/25 has-focus-visible:outline-2 has-focus-visible:outline-accent"
              >
                <input
                  type="radio"
                  name="category"
                  value={key}
                  checked={category === key}
                  onChange={() => setCategory(key)}
                  className="sr-only"
                />
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${eventCategories[key].dot}`} />
                {eventCategories[key].label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          메모 <span className="sr-only">(선택)</span>
          <textarea
            rows={3}
            maxLength={500}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="필요하면 메모를 남겨 주세요"
            className={`${inputClass} resize-none`}
          />
        </label>

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
            disabled={pending}
            className="rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/25 transition hover:brightness-105 disabled:opacity-60"
          >
            {pending ? "저장 중…" : "저장"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
