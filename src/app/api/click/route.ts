import { connection } from "next/server";
import { isLinkId } from "@/data/profile";
import { getDb } from "@/lib/mongodb";

type ClickDoc = {
  linkId: string;
  count: number;
  updatedAt: Date;
};

async function getClicks() {
  const db = await getDb();
  return db.collection<ClickDoc>("clicks");
}

export async function POST(request: Request) {
  // sendBeacon은 text/plain으로 보내므로 직접 파싱
  let linkId: unknown;
  try {
    linkId = JSON.parse(await request.text())?.linkId;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!isLinkId(linkId)) {
    return Response.json({ error: "Unknown linkId" }, { status: 400 });
  }

  try {
    const clicks = await getClicks();
    await clicks.updateOne(
      { linkId },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true },
    );
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[api/click] failed to record click", error);
    return Response.json({ error: "Click tracking unavailable" }, { status: 503 });
  }
}

export async function GET() {
  await connection();
  try {
    const clicks = await getClicks();
    const docs = await clicks.find({}, { projection: { _id: 0 } }).toArray();
    return Response.json(
      Object.fromEntries(docs.map((doc) => [doc.linkId, doc.count])),
    );
  } catch (error) {
    console.error("[api/click] failed to read clicks", error);
    return Response.json({ error: "Click tracking unavailable" }, { status: 503 });
  }
}
