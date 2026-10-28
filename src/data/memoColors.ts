// 메모 포스트잇 색상. card는 바둑판 카드 배경, dot은 선택 칩에 사용
export const memoColors = {
  green: { label: "초록", card: "bg-green-200 text-green-950", dot: "bg-green-300" },
  blue: { label: "파랑", card: "bg-sky-200 text-sky-950", dot: "bg-sky-300" },
  yellow: { label: "노랑", card: "bg-amber-100 text-amber-950", dot: "bg-amber-200" },
  pink: { label: "분홍", card: "bg-rose-200 text-rose-950", dot: "bg-rose-300" },
} as const;

export type MemoColor = keyof typeof memoColors;

export const memoColorKeys = Object.keys(memoColors) as MemoColor[];

export function isMemoColor(value: unknown): value is MemoColor {
  return typeof value === "string" && value in memoColors;
}

// 클라이언트와 API가 주고받는 메모 형태
export type Memo = {
  id: string;
  title: string;
  content: string;
  color: MemoColor;
};
