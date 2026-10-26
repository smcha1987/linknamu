import { connection } from "next/server";
import { getEvents, parseEventInput, toCalendarEvent } from "@/lib/events";

export async function GET(request: Request) {
  await connection();
  const year = Number(new URL(request.url).searchParams.get("year"));
  if (!Number.isInteger(year) || year < 1900 || year > 2999) {
    return Response.json({ error: "Invalid year" }, { status: 400 });
  }

  try {
    const events = await getEvents();
    // date가 "YYYY-MM-DD" 문자열이라 문자열 범위 비교로 연도 필터링 가능
    const docs = await events
      .find({ date: { $gte: `${year}-01-01`, $lte: `${year}-12-31` } })
      .sort({ date: 1, createdAt: 1 })
      .toArray();
    return Response.json(docs.map(toCalendarEvent));
  } catch (error) {
    console.error("[api/events] failed to read events", error);
    return Response.json({ error: "Calendar unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const input = await parseEventInput(request);
  if (typeof input === "string") {
    return Response.json({ error: input }, { status: 400 });
  }

  try {
    const events = await getEvents();
    const now = new Date();
    const doc = { ...input, createdAt: now, updatedAt: now };
    const { insertedId } = await events.insertOne(doc);
    return Response.json(toCalendarEvent({ ...doc, _id: insertedId }), { status: 201 });
  } catch (error) {
    console.error("[api/events] failed to create event", error);
    return Response.json({ error: "Calendar unavailable" }, { status: 503 });
  }
}
