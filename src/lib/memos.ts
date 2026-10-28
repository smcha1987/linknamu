import type { ObjectId, WithId } from "mongodb";
import { isMemoColor, type Memo, type MemoColor } from "@/data/memoColors";
import { getDb } from "./mongodb";

export type MemoDoc = {
  _id?: ObjectId;
  title: string;
  content: string;
  color: MemoColor;
  createdAt: Date;
  updatedAt: Date;
};

export type MemoInput = Pick<MemoDoc, "title" | "content" | "color">;

export async function getMemos() {
  const db = await getDb();
  return db.collection<MemoDoc>("memos");
}

export function toMemo(doc: WithId<MemoDoc>): Memo {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    content: doc.content,
    color: doc.color,
  };
}

// 요청 본문 검증. 실패하면 오류 메시지 문자열을 반환
export async function parseMemoInput(request: Request): Promise<MemoInput | string> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return "Invalid JSON";
  }
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!title && !content) return "제목이나 내용을 입력하세요";
  if (title.length > 50) return "제목은 50자 이내로 입력하세요";
  if (content.length > 2000) return "내용은 2000자 이내로 입력하세요";
  if (!isMemoColor(body.color)) return "알 수 없는 색상입니다";
  return { title, content, color: body.color };
}
