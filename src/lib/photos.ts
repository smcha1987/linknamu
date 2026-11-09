import { head } from "@vercel/blob";
import type { ObjectId } from "mongodb";
import { albumFromPath, ALLOWED_PHOTO_TYPES, MAX_PHOTO_BYTES, type Album } from "@/data/photoRules";
import { getDb } from "./mongodb";

export type PhotoDoc = {
  _id?: ObjectId;
  album: string;
  url: string;
  pathname: string;
  size: number;
  contentType: string;
  createdAt: Date;
};

export async function getPhotos() {
  const db = await getDb();
  return db.collection<PhotoDoc>("photos");
}

// 업로드된 사진 목록을 목차별로 묶음 (목차 순서 = 처음 만들어진 순)
export async function listAlbums(): Promise<Album[]> {
  const photos = await getPhotos();
  const docs = await photos.find().sort({ createdAt: 1 }).toArray();
  const albums = new Map<string, Album>();
  for (const doc of docs) {
    const album = albums.get(doc.album) ?? { name: doc.album, photos: [] };
    album.photos.push({ url: doc.url, alt: `${doc.album} 사진 ${album.photos.length + 1}` });
    albums.set(doc.album, album);
  }
  return [...albums.values()];
}

// 우리 Blob 저장소의 URL인지 확인 (토큰: vercel_blob_rw_<storeId>_<secret>)
function isOwnBlobUrl(url: URL): boolean {
  if (url.protocol !== "https:" || !url.hostname.endsWith(".public.blob.vercel-storage.com")) {
    return false;
  }
  const storeId = process.env.BLOB_READ_WRITE_TOKEN?.split("_")[3]?.toLowerCase();
  return !storeId || url.hostname.startsWith(`${storeId}.`);
}

// 업로드 완료된 Blob을 DB에 등록. 같은 경로는 한 번만 저장(upsert)
// 실제 Blob 메타데이터(head)로 형식·용량을 다시 확인해 위조된 등록을 막음
export async function registerPhoto(rawUrl: unknown): Promise<PhotoDoc | string> {
  let url: URL;
  try {
    url = new URL(String(rawUrl));
  } catch {
    return "잘못된 사진 주소입니다";
  }
  if (!isOwnBlobUrl(url)) return "이 저장소의 사진이 아닙니다";

  let meta;
  try {
    meta = await head(url.href);
  } catch {
    return "업로드된 사진을 찾을 수 없습니다";
  }

  const album = albumFromPath(meta.pathname);
  if (!album) return "사진 경로가 올바르지 않습니다";
  if (!ALLOWED_PHOTO_TYPES.includes(meta.contentType)) return "지원하지 않는 형식입니다";
  if (meta.size > MAX_PHOTO_BYTES) return "4MB를 넘는 사진입니다";

  const doc: PhotoDoc = {
    album,
    url: meta.url,
    pathname: meta.pathname,
    size: meta.size,
    contentType: meta.contentType,
    createdAt: new Date(meta.uploadedAt),
  };
  const photos = await getPhotos();
  await photos.updateOne({ pathname: doc.pathname }, { $setOnInsert: doc }, { upsert: true });
  return doc;
}
