"use client";

import type { LinkItem } from "@/data/profile";
import { trackClick } from "@/lib/trackClick";

export const cardClassName =
  "block w-full rounded-2xl border-2 border-foreground px-5 py-4 text-center font-semibold transition hover:-translate-y-0.5 hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:translate-y-0";

export default function LinkCard({
  link,
}: {
  link: Extract<LinkItem, { kind: "link" }>;
}) {
  // mailto: 등은 새 탭이 아니라 현재 창에서 처리
  const external = /^https?:\/\//.test(link.url);
  return (
    <a
      href={link.url}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      onClick={() => trackClick(link.id)}
      className={cardClassName}
    >
      {link.title}
    </a>
  );
}
