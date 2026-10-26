import type { ObjectId, WithId } from "mongodb";
import { isEventCategory, type CalendarEvent, type EventCategory } from "@/data/eventCategories";
import { isDateKey } from "./date";
import { getDb } from "./mongodb";

export type EventDoc = {
  _id?: ObjectId;
  title: string;
  date: string;
  category: EventCategory;
  memo: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EventInput = Pick<EventDoc, "title" | "date" | "category" | "memo">;

export async function getEvents() {
  const db = await getDb();
  return db.collection<EventDoc>("events");
}

export function toCalendarEvent(doc: WithId<EventDoc>): CalendarEvent {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    date: doc.date,
    category: doc.category,
    memo: doc.memo,
  };
}

// 요청 본문 검증. 실패하면 오류 메시지 문자열을 반환
export async function parseEventInput(request: Request): Promise<EventInput | string> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return "Invalid JSON";
  }
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const memo = typeof body?.memo === "string" ? body.memo.trim() : "";
  if (title.length < 1 || title.length > 50) return "제목은 1~50자로 입력하세요";
  if (memo.length > 500) return "메모는 500자 이내로 입력하세요";
  if (!isDateKey(body.date)) return "날짜 형식이 올바르지 않습니다";
  if (!isEventCategory(body.category)) return "알 수 없는 분류입니다";
  return { title, memo, date: body.date, category: body.category };
}
