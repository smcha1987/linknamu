// 시간대 영향을 받지 않도록 날짜는 로컬 기준 "YYYY-MM-DD" 문자열로 다룸
export function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// 서버(UTC)에서 계산해도 한국 날짜가 나오도록 시간대를 고정
export function seoulTodayKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
}

export function parseDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return { year, month: month - 1, day };
}

export function isDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export type GridDay = { key: string; day: number; weekday: number; inMonth: boolean };

// 일요일 시작 6주(42칸) 달력. month는 0부터 시작
export function monthGrid(year: number, month: number): GridDay[] {
  const start = new Date(year, month, 1 - new Date(year, month, 1).getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return {
      key: toDateKey(date.getFullYear(), date.getMonth(), date.getDate()),
      day: date.getDate(),
      weekday: date.getDay(),
      inMonth: date.getMonth() === month,
    };
  });
}
