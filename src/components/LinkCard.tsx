"use client";

import type { LinkItem } from "@/data/profile";

function trackClick(linkId: string) {
  const body = JSON.stringify({ linkId });
  // 페이지 이동 중에도 요청이 끊기지 않도록 sendBeacon 우선 사용
  if (navigator.sendBeacon?.("/api/click", body)) return;
  fetch("/api/click", { method: "POST", body, keepalive: true }).catch(() => {});
}

export default function LinkCard({ link }: { link: LinkItem }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClick(link.id)}
      className="block w-full rounded-2xl border-2 border-foreground px-5 py-4 text-center font-semibold transition hover:-translate-y-0.5 hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:translate-y-0"
    >
      {link.title}
    </a>
  );
}
