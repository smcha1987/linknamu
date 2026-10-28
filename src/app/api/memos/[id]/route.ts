import { ObjectId } from "mongodb";
import { getMemos, parseMemoInput, toMemo } from "@/lib/memos";

async function parseId(ctx: RouteContext<"/api/memos/[id]">) {
  const { id } = await ctx.params;
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/memos/[id]">) {
  const _id = await parseId(ctx);
  if (!_id) return Response.json({ error: "Invalid id" }, { status: 400 });
  const input = await parseMemoInput(request);
  if (typeof input === "string") {
    return Response.json({ error: input }, { status: 400 });
  }

  try {
    const memos = await getMemos();
    const doc = await memos.findOneAndUpdate(
      { _id },
      { $set: { ...input, updatedAt: new Date() } },
      { returnDocument: "after" },
    );
    if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(toMemo(doc));
  } catch (error) {
    console.error("[api/memos] failed to update memo", error);
    return Response.json({ error: "Memo unavailable" }, { status: 503 });
  }
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/memos/[id]">) {
  const _id = await parseId(ctx);
  if (!_id) return Response.json({ error: "Invalid id" }, { status: 400 });

  try {
    const memos = await getMemos();
    const { deletedCount } = await memos.deleteOne({ _id });
    if (!deletedCount) return Response.json({ error: "Not found" }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[api/memos] failed to delete memo", error);
    return Response.json({ error: "Memo unavailable" }, { status: 503 });
  }
}
