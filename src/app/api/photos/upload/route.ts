import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { albumFromPath, ALLOWED_PHOTO_TYPES, MAX_PHOTO_BYTES, MAX_PHOTOS } from "@/data/photoRules";
import { getPhotos, registerPhoto } from "@/lib/photos";

// 브라우저 → Vercel Blob 직접 업로드용 토큰 발급
// 형식과 2MB 제한은 토큰에 담겨 Blob 서버가 강제하므로 브라우저 검사를 우회해도 막힘
export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!albumFromPath(pathname)) throw new Error("사진 경로가 올바르지 않습니다");
        const photos = await getPhotos();
        if ((await photos.countDocuments()) >= MAX_PHOTOS) {
          throw new Error("사진관이 가득 찼어요 (저장 용량 한도)");
        }
        return {
          allowedContentTypes: ALLOWED_PHOTO_TYPES,
          maximumSizeInBytes: MAX_PHOTO_BYTES,
          addRandomSuffix: true,
        };
      },
      // 배포 환경에서 Vercel Blob이 호출. 브라우저가 등록을 빠뜨려도 목록에 남도록 함
      // (localhost에서는 호출되지 않으므로 브라우저의 POST /api/photos가 등록을 담당)
      onUploadCompleted: async ({ blob }) => {
        const result = await registerPhoto(blob.url);
        if (typeof result === "string") throw new Error(result);
      },
    });
    return Response.json(json);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
