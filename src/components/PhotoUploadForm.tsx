"use client";

import { upload } from "@vercel/blob/client";
import { useId, useState } from "react";
import {
  ALLOWED_PHOTO_TYPES,
  MAX_PHOTO_BYTES,
  normalizeAlbum,
  photoPath,
} from "@/data/photoRules";

const NEW_ALBUM = "__new__";

type Props = {
  albums: string[]; // 업로드 가능한 목차 이름 ('기본' 제외)
  initialAlbum?: string;
  onUploaded: (album: string) => void;
};

export default function PhotoUploadForm({ albums, initialAlbum, onUploaded }: Props) {
  const id = useId();
  const [choice, setChoice] = useState(initialAlbum && albums.includes(initialAlbum) ? initialAlbum : albums[0] ?? NEW_ALBUM);
  const [newName, setNewName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<{ tone: "info" | "error" | "ok"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const pickFiles = (list: FileList | null) => {
    const picked = Array.from(list ?? []);
    const bad = picked.filter((f) => !ALLOWED_PHOTO_TYPES.includes(f.type) || f.size > MAX_PHOTO_BYTES);
    const ok = picked.filter((f) => !bad.includes(f));
    setFiles(ok);
    setStatus(
      bad.length
        ? { tone: "error", text: `제외됨: ${bad.map((f) => f.name).join(", ")} (gif·png·jpg·webp, 2MB 이하만 가능)` }
        : null,
    );
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const album = normalizeAlbum(choice === NEW_ALBUM ? newName : choice);
    if ("error" in album) return setStatus({ tone: "error", text: album.error });
    if (!files.length) return setStatus({ tone: "error", text: "올릴 사진을 골라 주세요" });

    setBusy(true);
    let done = 0;
    const failed: string[] = [];
    for (const file of files) {
      setStatus({ tone: "info", text: `업로드 중… ${done + 1} / ${files.length}` });
      try {
        const blob = await upload(photoPath(album.name, file.name), file, {
          access: "public",
          handleUploadUrl: "/api/photos/upload",
          contentType: file.type,
        });
        const res = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: blob.url }),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "등록 실패");
        done++;
      } catch (error) {
        console.error("[PhotoUploadForm] upload failed", error);
        failed.push(file.name);
      }
    }
    setBusy(false);
    setFiles([]);
    (e.target as HTMLFormElement).reset();

    if (done) onUploaded(album.name);
    setStatus(
      failed.length
        ? { tone: "error", text: `${done}장 성공, 실패: ${failed.join(", ")}` }
        : { tone: "ok", text: `${done}장을 '${album.name}'에 올렸어요` },
    );
  };

  const field =
    "w-full rounded-lg border border-line bg-white/70 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-accent dark:bg-white/5";

  return (
    <form onSubmit={submit} className="mb-4 flex flex-col gap-2.5 rounded-xl border border-line p-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-album`} className="sr-only">
          목차
        </label>
        <select
          id={`${id}-album`}
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          disabled={busy}
          className={field}
        >
          {albums.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value={NEW_ALBUM}>+ 새 목차 만들기</option>
        </select>
        {choice === NEW_ALBUM && (
          <>
            <label htmlFor={`${id}-new`} className="sr-only">
              새 목차 이름
            </label>
            <input
              id={`${id}-new`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="새 목차 이름 (20자 이내)"
              maxLength={20}
              disabled={busy}
              className={field}
            />
          </>
        )}
      </div>

      <label htmlFor={`${id}-file`} className="sr-only">
        사진 파일
      </label>
      <input
        id={`${id}-file`}
        type="file"
        multiple
        accept={ALLOWED_PHOTO_TYPES.join(",")}
        onChange={(e) => pickFiles(e.target.files)}
        disabled={busy}
        className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-accent/15 file:px-3 file:py-2 file:text-sm file:font-medium"
      />
      <p className="text-xs opacity-60">gif · png · jpg · webp, 한 장에 2MB 이하</p>

      <button
        type="submit"
        disabled={busy || !files.length}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? "올리는 중…" : files.length ? `${files.length}장 올리기` : "사진 올리기"}
      </button>

      {status && (
        <p
          role={status.tone === "error" ? "alert" : "status"}
          className={`break-keep text-xs ${status.tone === "error" ? "text-red-500" : status.tone === "ok" ? "text-emerald-600" : "opacity-70"}`}
        >
          {status.text}
        </p>
      )}
    </form>
  );
}
