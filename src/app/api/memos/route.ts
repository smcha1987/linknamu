import { connection } from "next/server";
import { getMemos, parseMemoInput, toMemo } from "@/lib/memos";

export async function GET() {
  await connection();
  try {
    const memos = await getMemos();
    const docs = await memos.find().sort({ createdAt: 1 }).toArray();
    return Response.json(docs.map(toMemo));
  } catch (error) {
    console.error("[api/memos] failed to read memos", error);
    return Response.json({ error: "Memo unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const input = await parseMemoInput(request);
  if (typeof input === "string") {
    return Response.json({ error: input }, { status: 400 });
  }

  try {
    const memos = await getMemos();
    const now = new Date();
    const doc = { ...input, createdAt: now, updatedAt: now };
    const { insertedId } = await memos.insertOne(doc);
    return Response.json(toMemo({ ...doc, _id: insertedId }), { status: 201 });
  } catch (error) {
    console.error("[api/memos] failed to create memo", error);
    return Response.json({ error: "Memo unavailable" }, { status: 503 });
  }
}
