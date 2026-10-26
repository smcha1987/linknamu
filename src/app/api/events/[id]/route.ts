import { ObjectId } from "mongodb";
import { getEvents, parseEventInput, toCalendarEvent } from "@/lib/events";

async function parseId(ctx: RouteContext<"/api/events/[id]">) {
  const { id } = await ctx.params;
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/events/[id]">) {
  const _id = await parseId(ctx);
  if (!_id) return Response.json({ error: "Invalid id" }, { status: 400 });
  const input = await parseEventInput(request);
  if (typeof input === "string") {
    return Response.json({ error: input }, { status: 400 });
  }

  try {
    const events = await getEvents();
    const doc = await events.findOneAndUpdate(
      { _id },
      { $set: { ...input, updatedAt: new Date() } },
      { returnDocument: "after" },
    );
    if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(toCalendarEvent(doc));
  } catch (error) {
    console.error("[api/events] failed to update event", error);
    return Response.json({ error: "Calendar unavailable" }, { status: 503 });
  }
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/events/[id]">) {
  const _id = await parseId(ctx);
  if (!_id) return Response.json({ error: "Invalid id" }, { status: 400 });

  try {
    const events = await getEvents();
    const { deletedCount } = await events.deleteOne({ _id });
    if (!deletedCount) return Response.json({ error: "Not found" }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[api/events] failed to delete event", error);
    return Response.json({ error: "Calendar unavailable" }, { status: 503 });
  }
}
