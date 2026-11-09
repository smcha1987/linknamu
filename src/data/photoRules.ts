// 사진관 업로드 규칙. 브라우저(즉시 안내)와 서버(실제 강제)가 함께 사용

export const ALLOWED_PHOTO_TYPES = ["image/gif", "image/png", "image/jpeg", "image/webp"];
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // 4MB

// Vercel Blob 무료(Hobby) 저장 용량 1GB를 넘지 않도록 전체 장수 상한 (200장 × 4MB = 최대 800MB)
export const MAX_PHOTOS = 200;

// 정적 사진(src/assets/gallery)이 들어가는 목차 이름
export const DEFAULT_ALBUM = "기본";

// Blob 폴더 경로: gallery/<목차>/<파일>
export const PHOTO_ROOT = "gallery";

export type Photo = { url: string; alt: string; width?: number; height?: number };
export type Album = { name: string; photos: Photo[] };

// 목차 이름 검증. 올바르면 정리된 이름, 아니면 오류 메시지 객체를 반환
export function normalizeAlbum(input: unknown): { name: string } | { error: string } {
  const name = typeof input === "string" ? input.trim().replace(/\s+/g, " ") : "";
  if (!name) return { error: "목차 이름을 입력하세요" };
  if (name.length > 20) return { error: "목차 이름은 20자 이내로 입력하세요" };
  if (/[/\\?#%]|\.\./.test(name)) return { error: "목차 이름에 / \\ ? # % .. 는 쓸 수 없어요" };
  if (name === DEFAULT_ALBUM) return { error: `'${DEFAULT_ALBUM}' 목차에는 업로드할 수 없어요` };
  return { name };
}

// 파일 이름을 Blob 경로에 안전한 형태로 정리 (확장자 유지)
export function safeFileName(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  const base = (dot > 0 ? fileName.slice(0, dot) : fileName)
    .replace(/[^\p{L}\p{N}_-]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "photo";
  const ext = dot > 0 ? fileName.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  return ext ? `${base}.${ext}` : base;
}

export function photoPath(album: string, fileName: string): string {
  return `${PHOTO_ROOT}/${album}/${safeFileName(fileName)}`;
}

// gallery/<목차>/<파일> 경로에서 목차 이름을 꺼냄. 형식이 다르면 null
export function albumFromPath(pathname: string): string | null {
  const parts = pathname.split("/");
  if (parts.length !== 3 || parts[0] !== PHOTO_ROOT || !parts[2]) return null;
  const result = normalizeAlbum(parts[1]);
  return "name" in result && result.name === parts[1] ? result.name : null;
}
