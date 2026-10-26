import { eventCategories, type CalendarEvent } from "@/data/eventCategories";
import { monthGrid } from "@/lib/date";

export const iconButton =
  "grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface-strong text-lg leading-none text-muted transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MAX_BARS = 3;

type MonthGridProps = {
  year: number;
  month: number;
  today: string;
  events: CalendarEvent[];
  onMove: (delta: number) => void;
  onToday: () => void;
  onAdd: (date: string) => void;
  onEdit: (event: CalendarEvent) => void;
};

function weekdayText(weekday: number) {
  if (weekday === 0) return "text-red-500";
  if (weekday === 6) return "text-blue-500";
  return "";
}

export default function MonthGrid({ year, month, today, events, onMove, onToday, onAdd, onEdit }: MonthGridProps) {
  const byDate = new Map<string, CalendarEvent[]>();
  for (const event of events) byDate.set(event.date, [...(byDate.get(event.date) ?? []), event]);
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthEvents = events.filter((event) => event.date.startsWith(monthPrefix));

  return (
    <div className="rounded-3xl border border-line bg-surface p-3 shadow-sm backdrop-blur-md sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <button type="button" onClick={() => onMove(-1)} aria-label="이전 달" className={iconButton}>
          ‹
        </button>
        <h2 className="min-w-28 text-center text-lg font-bold tabular-nums" aria-live="polite">
          {monthPrefix} 상세
        </h2>
        <button type="button" onClick={() => onMove(1)} aria-label="다음 달" className={iconButton}>
          ›
        </button>
        <button
          type="button"
          onClick={onToday}
          className="ml-auto rounded-lg border border-line bg-surface-strong px-3 py-1.5 text-sm font-semibold text-muted transition hover:text-foreground"
        >
          오늘
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {WEEKDAYS.map((label, weekday) => (
          <div key={label} className={`py-1 text-center text-xs font-bold text-muted ${weekdayText(weekday)}`}>
            {label}
          </div>
        ))}
        {monthGrid(year, month).map((cell) => {
          const dayEvents = byDate.get(cell.key) ?? [];
          const weekend = cell.weekday === 0 || cell.weekday === 6;
          const isToday = cell.key === today;
          return (
            // 칸 아무 곳이나 클릭해도 추가되도록 하고, 키보드 사용자는 날짜 버튼을 이용
            <div
              key={cell.key}
              onClick={() => onAdd(cell.key)}
              className={[
                "flex min-h-18 cursor-pointer flex-col gap-0.5 overflow-hidden rounded-lg border p-1 transition sm:min-h-24 sm:rounded-xl sm:p-1.5",
                cell.inMonth ? "" : "opacity-40",
                isToday ? "border-accent ring-2 ring-accent/30" : "border-line",
                cell.weekday === 0 ? "bg-red-500/[0.06]" : cell.weekday === 6 ? "bg-blue-500/[0.06]" : "bg-surface-strong",
                "hover:border-accent/60",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(cell.key);
                }}
                aria-label={`${cell.key} 일정 추가`}
                className={`w-fit rounded px-0.5 text-left text-xs font-semibold sm:text-sm ${
                  isToday ? "text-accent" : weekend ? weekdayText(cell.weekday) : ""
                }`}
              >
                {cell.day}
              </button>
              {dayEvents.slice(0, MAX_BARS).map((event) => (
                <button
                  key={event.id}
                  type="button"
                  title={event.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(event);
                  }}
                  className={`truncate rounded px-1 py-px text-left text-[10px] font-semibold leading-tight sm:text-[11px] ${eventCategories[event.category].bar}`}
                >
                  {event.title}
                </button>
              ))}
              {dayEvents.length > MAX_BARS && (
                <span className="px-1 text-[10px] font-semibold text-muted">+{dayEvents.length - MAX_BARS}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <h3 className="mb-2 text-sm font-bold">이번 달 일정 {monthEvents.length}건</h3>
        {monthEvents.length === 0 ? (
          <p className="text-sm text-muted">등록된 일정이 없어요. 날짜를 눌러 추가해 보세요.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {monthEvents.map((event) => {
              const category = eventCategories[event.category];
              return (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => onEdit(event)}
                    className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm transition hover:bg-line"
                  >
                    <span className="w-12 shrink-0 tabular-nums text-muted">{event.date.slice(5).replace("-", ".")}</span>
                    <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold ${category.badge}`}>
                      {category.label}
                    </span>
                    <span className="truncate font-medium">{event.title}</span>
                    {event.memo && <span className="hidden truncate text-muted sm:inline">· {event.memo}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
