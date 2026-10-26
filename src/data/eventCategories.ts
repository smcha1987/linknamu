// 일정 분류. badge는 연간 카드 배지, bar는 달력 칸의 색상 바, dot은 선택 칩에 사용
export const eventCategories = {
  schedule: { label: "일정", badge: "bg-blue-600 text-white", bar: "bg-blue-600 text-white", dot: "bg-blue-600" },
  hospital: { label: "병원", badge: "bg-emerald-600 text-white", bar: "bg-emerald-600 text-white", dot: "bg-emerald-600" },
  school: { label: "학교", badge: "bg-amber-500 text-white", bar: "bg-amber-500 text-white", dot: "bg-amber-500" },
  anniversary: { label: "기념일", badge: "bg-pink-500 text-white", bar: "bg-pink-500 text-white", dot: "bg-pink-500" },
  etc: { label: "기타", badge: "bg-slate-500 text-white", bar: "bg-slate-500 text-white", dot: "bg-slate-500" },
} as const;

export type EventCategory = keyof typeof eventCategories;

export const categoryKeys = Object.keys(eventCategories) as EventCategory[];

export function isEventCategory(value: unknown): value is EventCategory {
  return typeof value === "string" && value in eventCategories;
}

// 클라이언트와 API가 주고받는 일정 형태
export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  category: EventCategory;
  memo: string;
};
