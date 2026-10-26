"use client";

import { useEffect, useState } from "react";
import type { CalendarEvent } from "@/data/eventCategories";
import { parseDateKey } from "@/lib/date";
import EventForm, { type EventDraft } from "./EventForm";
import MonthGrid, { iconButton } from "./MonthGrid";
import YearOverview from "./YearOverview";

export default function CalendarApp({ today }: { today: string }) {
  const initial = parseDateKey(today);
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [draft, setDraft] = useState<EventDraft | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/events?year=${year}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setEvents(await res.json());
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("[calendar] failed to load events", error);
        setStatus("error");
      }
    })();
    return () => controller.abort();
  }, [year, reloadKey]);

  function changeYear(next: number) {
    setStatus("loading");
    setYear(next);
  }

  // 월 이동이 연도를 넘어가면 연도도 함께 변경
  function moveMonth(delta: number) {
    const date = new Date(year, month + delta, 1);
    if (date.getFullYear() !== year) changeYear(date.getFullYear());
    setMonth(date.getMonth());
  }

  function goToday() {
    if (initial.year !== year) changeYear(initial.year);
    setMonth(initial.month);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 backdrop-blur-md">
        <span className="text-sm font-semibold text-muted">작업년도</span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => changeYear(year - 1)} aria-label="이전 연도" className={iconButton}>
            ‹
          </button>
          <span className="min-w-16 text-center text-lg font-bold tabular-nums">{year}</span>
          <button type="button" onClick={() => changeYear(year + 1)} aria-label="다음 연도" className={iconButton}>
            ›
          </button>
        </div>
        <span className="ml-auto text-sm text-muted">
          {status === "loading" && "불러오는 중…"}
          {status === "ready" && `${year}년 일정 ${events.length}건`}
          {status === "error" && (
            <span className="text-red-500">
              일정을 불러오지 못했어요.{" "}
              <button type="button" className="underline" onClick={() => setReloadKey((k) => k + 1)}>
                다시 시도
              </button>
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={() => setDraft({ date: `${year}-${String(month + 1).padStart(2, "0")}-01` })}
          className="rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/25 transition hover:brightness-105"
        >
          + 일정 추가
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section className="order-2 lg:order-1" aria-labelledby="year-overview-title">
          <h2 id="year-overview-title" className="mb-3 text-lg font-bold">
            월별 일정 <span className="text-sm font-medium text-muted">({year})</span>
          </h2>
          <YearOverview year={year} month={month} events={events} onSelectMonth={setMonth} />
        </section>
        <section className="order-1 lg:order-2" aria-label="월 상세 달력">
          <MonthGrid
            year={year}
            month={month}
            today={today}
            events={events}
            onMove={moveMonth}
            onToday={goToday}
            onAdd={(date) => setDraft({ date })}
            onEdit={(event) => setDraft(event)}
          />
        </section>
      </div>

      {draft && (
        <EventForm
          key={"id" in draft ? draft.id : draft.date}
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
