import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import CalendarApp from "@/components/calendar/CalendarApp";
import { seoulTodayKey } from "@/lib/date";

export const metadata: Metadata = {
  title: "아영이네의 일정관리",
  description: "가족 일정을 달력으로 기록하고 관리해요.",
};

// 오늘 날짜는 요청 시점에 계산해야 하므로 동적 영역으로 분리
async function CalendarWithToday() {
  await connection();
  return <CalendarApp today={seoulTodayKey()} />;
}

export default function CalendarPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:py-10">
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
            📅
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">아영이네의 일정관리</h1>
            <p className="text-sm text-muted">날짜를 눌러 일정을 추가하고, 일정을 눌러 수정·삭제하세요.</p>
          </div>
        </div>
      </header>
      <Suspense fallback={<p className="py-20 text-center text-muted">달력을 불러오는 중…</p>}>
        <CalendarWithToday />
      </Suspense>
    </main>
  );
}
