import { connection } from "next/server";
import { listAlbums, registerPhoto } from "@/lib/photos";

export async function GET() {
  await connection();
  try {
    return Response.json(await listAlbums());
  } catch (error) {
    console.error("[api/photos] failed to read photos", error);
    return Response.json({ error: "Photos unavailable" }, { status: 503 });
  }
}

// 브라우저가 Blob 업로드를 마친 뒤 사진을 목록에 등록
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const result = await registerPhoto(body?.url);
    if (typeof result === "string") {
      return Response.json({ error: result }, { status: 400 });
    }
    return Response.json({ album: result.album, url: result.url }, { status: 201 });
  } catch (error) {
    console.error("[api/photos] failed to register photo", error);
    return Response.json({ error: "Photos unavailable" }, { status: 503 });
  }
}
