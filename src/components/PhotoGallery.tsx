"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { galleryPhotos } from "@/data/gallery";
import { DEFAULT_ALBUM, type Album } from "@/data/photoRules";
import PhotoUploadForm from "./PhotoUploadForm";

// 정적 사진(빌드 시 blur 생성)과 업로드 사진(Blob URL)을 함께 다루기 위한 형태
type ViewPhoto = { key: string; alt: string; src: StaticImageData | string };

const defaultPhotos: ViewPhoto[] = galleryPhotos.map((p) => ({ key: p.src.src, alt: p.alt, src: p.src }));

export default function PhotoGallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [current, setCurrent] = useState(DEFAULT_ALBUM);
  const [showUpload, setShowUpload] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // 크게 보는 중인 사진 번호. null이면 라이트박스 닫힘
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const loadAlbums = useCallback(async () => {
    try {
      const res = await fetch("/api/photos", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      setAlbums(await res.json());
      setLoadError(false);
    } catch (error) {
      console.error("[PhotoGallery] failed to load albums", error);
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    // 마운트 시 업로드된 목차를 불러옴 (외부 데이터 동기화)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAlbums();
  }, [loadAlbums]);

  const photos: ViewPhoto[] =
    current === DEFAULT_ALBUM
      ? defaultPhotos
      : (albums.find((a) => a.name === current)?.photos ?? []).map((p) => ({ key: p.url, alt: p.alt, src: p.url }));
  const count = photos.length;

  const show = (i: number) => setIndex((i + count) % count);
  const prev = () => index !== null && show(index - 1);
  const next = () => index !== null && show(index + 1);

  // 모달 위에 한 겹 더 띄우기 위해 라이트박스도 showModal()로 최상위 레이어에 올림
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  const tabs = [DEFAULT_ALBUM, ...albums.map((a) => a.name)];
  const active = index !== null ? photos[index] : null;

  return (
    <>
      {/* 목차 탭: 가로 스크롤 */}
      <div className="mb-3 flex items-center gap-2">
        <div role="tablist" aria-label="사진 목차" className="-mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1 pb-1">
          {tabs.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={current === name}
              onClick={() => {
                setCurrent(name);
                setIndex(null);
              }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-accent ${
                current === name ? "bg-accent font-semibold text-white" : "bg-line/60 hover:bg-line"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowUpload((v) => !v)}
          aria-expanded={showUpload}
          className="shrink-0 rounded-full border border-accent/60 px-3 py-1.5 text-sm font-medium text-accent transition hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-accent"
        >
          {showUpload ? "닫기" : "＋ 사진 올리기"}
        </button>
      </div>

      {showUpload && (
        <PhotoUploadForm
          albums={albums.map((a) => a.name)}
          initialAlbum={current}
          onUploaded={async (album) => {
            await loadAlbums();
            setCurrent(album);
          }}
        />
      )}

      {loadError && current !== DEFAULT_ALBUM && (
        <p role="alert" className="mb-3 text-sm text-red-500">
          사진을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {count === 0 ? (
        <p className="py-10 text-center text-sm opacity-60">아직 사진이 없어요. 첫 사진을 올려 보세요!</p>
      ) : (
        <ul key={current} className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {photos.map((photo, i) => (
            <li
              key={photo.key}
              // 사진이 하나씩 순서대로 떠오르는 등장 효과
              style={{ animationDelay: `${Math.min(i, 12) * 70}ms` }}
              className="motion-safe:animate-[gallery-rise_0.55s_cubic-bezier(0.22,1,0.36,1)_both]"
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${photo.alt} 크게 보기`}
                className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl bg-line shadow-sm ring-1 ring-line transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 hover:ring-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {typeof photo.src === "string" ? (
                  // 업로드 사진: 최적화 없이 원본 표시 (GIF 애니메이션 유지, 이미지 최적화 무료 한도 절약)
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover transition duration-500 ease-out group-hover:scale-110"
                  />
                ) : (
                  <Image
                    src={photo.src}
                    alt=""
                    placeholder="blur"
                    sizes="(max-width: 640px) 50vw, 11rem"
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
                  />
                )}
                {/* 호버 시 아래에서 올라오는 그라디언트와 돋보기 */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center bg-linear-to-t from-black/45 via-black/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
                >
                  <span className="grid h-10 w-10 scale-75 place-items-center rounded-full bg-white/85 text-lg text-slate-900 shadow-lg backdrop-blur transition duration-300 group-hover:scale-100">
                    🔍
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        aria-label="사진 크게 보기"
        onClose={() => setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
        // 사진 바깥(배경)을 누르면 닫기
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop) {
            setIndex(null);
          }
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (dx > 50) prev();
          if (dx < -50) next();
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-slate-950/85 p-0 text-white backdrop-blur-xl backdrop:bg-transparent motion-safe:animate-[lightbox-fade_0.25s_ease-out]"
      >
        {active && index !== null && (
          <div data-backdrop="true" className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
            <figure
              // 사진이 바뀔 때마다 다시 확대 등장
              key={active.key}
              className="flex flex-col items-center gap-3 motion-safe:animate-[lightbox-zoom_0.4s_cubic-bezier(0.22,1,0.36,1)]"
            >
              {typeof active.src === "string" ? (
                <Image
                  src={active.src}
                  alt={active.alt}
                  width={1600}
                  height={1600}
                  unoptimized
                  className="h-auto max-h-[78dvh] w-auto max-w-[92vw] rounded-2xl object-contain shadow-2xl shadow-black/60"
                />
              ) : (
                <Image
                  src={active.src}
                  alt={active.alt}
                  placeholder="blur"
                  sizes="92vw"
                  className="h-auto max-h-[78dvh] w-auto max-w-[92vw] rounded-2xl object-contain shadow-2xl shadow-black/60"
                />
              )}
              <figcaption className="break-keep text-center text-sm text-white/80">{active.alt}</figcaption>
            </figure>
            <p className="rounded-full bg-white/10 px-3 py-1 text-xs tabular-nums text-white/80">
              {index + 1} / {count}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIndex(null)}
          aria-label="닫기"
          className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
        >
          <span aria-hidden="true">×</span>
        </button>
        <button
          type="button"
          onClick={prev}
          aria-label="이전 사진"
          className="absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-xl transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="다음 사진"
          className="absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-xl transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
        >
          <span aria-hidden="true">›</span>
        </button>
      </dialog>
    </>
  );
}
