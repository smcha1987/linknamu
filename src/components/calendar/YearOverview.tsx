import { eventCategories, type CalendarEvent } from "@/data/eventCategories";

const MAX_ROWS = 3;

type YearOverviewProps = {
  year: number;
  month: number;
  events: CalendarEvent[];
  onSelectMonth: (month: number) => void;
};

export default function YearOverview({ year, month, events, onSelectMonth }: YearOverviewProps) {
  // events는 날짜순으로 정렬되어 들어오므로 월별 묶음도 날짜순
  const byMonth = new Map<number, CalendarEvent[]>();
  for (const event of events) {
    const m = Number(event.date.slice(5, 7)) - 1;
    byMonth.set(m, [...(byMonth.get(m) ?? []), event]);
  }

  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {Array.from({ length: 12 }, (_, m) => {
        const monthEvents = byMonth.get(m) ?? [];
        const selected = m === month;
        return (
          <li key={m}>
            <button
              type="button"
              onClick={() => onSelectMonth(m)}
              aria-pressed={selected}
              aria-label={`${year}년 ${m + 1}월, 일정 ${monthEvents.length}건`}
              className={`flex h-full min-h-28 w-full flex-col gap-1.5 rounded-2xl border bg-surface p-3 text-left backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-md ${
                selected ? "border-accent ring-2 ring-accent/25" : "border-line"
              }`}
            >
              <span className="flex items-baseline justify-between">
                <span className="font-bold">{m + 1}월</span>
                {monthEvents.length > 0 && (
                  <span className="text-[11px] font-semibold text-muted">{monthEvents.length}건</span>
                )}
              </span>
              {monthEvents.slice(0, MAX_ROWS).map((event) => {
                const category = eventCategories[event.category];
                return (
                  <span key={event.id} className="flex min-w-0 items-center gap-1.5 text-xs">
                    <span className={`shrink-0 rounded px-1.5 py-px text-[10px] font-bold ${category.badge}`}>
                      {category.label}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted">{event.date.slice(5).replace("-", ".")}</span>
                    <span className="truncate">{event.title}</span>
                  </span>
                );
              })}
              {monthEvents.length > MAX_ROWS && (
                <span className="text-[11px] font-semibold text-muted">+{monthEvents.length - MAX_ROWS}건 더보기</span>
              )}
              {monthEvents.length === 0 && <span className="text-xs text-muted/70">일정 없음</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
