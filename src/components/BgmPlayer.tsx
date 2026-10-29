"use client";

import { useEffect, useRef, useState } from "react";
import { bgmTracks } from "@/data/bgm";

// 루트 레이아웃에 한 번만 두어 페이지를 이동해도 노래가 이어지게 함
export default function BgmPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  // 사용자가 직접 끄기 전까지는 재생을 원하는 상태. 새로 접속하면 항상 다시 켜짐
  const wantPlay = useRef(true);
  // 연속으로 불러오기에 실패한 곡 수. 모든 곡이 실패하면 건너뛰기를 멈춤
  const failCount = useRef(0);

  // 첫 진입과 곡이 바뀔 때마다 재생 시도
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !wantPlay.current) return;
    // 브라우저가 자동재생을 막으면 아래 첫 조작 리스너가 대신 재생함
    audio.play().catch(() => {});
  }, [index]);

  // 브라우저는 사용자 조작 전 소리 있는 자동재생을 막으므로, 첫 클릭·터치·키 입력 때 재생 시작
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.5;

    const unlock = (e: Event) => {
      // 스피커 버튼은 자체 onClick에서 처리 (여기서 켜면 곧바로 다시 꺼짐)
      if (buttonRef.current?.contains(e.target as Node)) return;
      const audio = audioRef.current;
      if (audio?.paused && wantPlay.current) audio.play().catch(() => {});
      removeListeners();
    };
    const removeListeners = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return removeListeners;
  }, []);

  const next = () => setIndex((i) => (i + 1) % bgmTracks.length);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      wantPlay.current = true;
      failCount.current = 0;
      // 현재 곡이 불러오기 실패 상태면 다음 곡으로 넘겨 재생 (index 변경 시 위 effect가 재생)
      if (audio.error) next();
      else audio.play().catch(() => {});
    } else {
      wantPlay.current = false;
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        // 파일명의 한글·공백을 URL 인코딩
        src={encodeURI(bgmTracks[index].src)}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onPlaying={() => {
          failCount.current = 0;
        }}
        onEnded={next}
        onError={() => {
          // 파일이 없거나 깨진 곡은 건너뜀
          failCount.current += 1;
          if (failCount.current < bgmTracks.length) next();
        }}
      />
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label={playing ? "배경음악 끄기" : "배경음악 켜기"}
        aria-pressed={playing}
        title={playing ? `재생 중: ${bgmTracks[index].title}` : "배경음악 켜기"}
        className="fixed top-4 right-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-foreground shadow-sm shadow-slate-900/5 backdrop-blur-md transition hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" />
          {playing ? (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M19 5a10 10 0 0 1 0 14" />
            </>
          ) : (
            <>
              <path d="m22 9-6 6" />
              <path d="m16 9 6 6" />
            </>
          )}
        </svg>
      </button>
    </>
  );
}
