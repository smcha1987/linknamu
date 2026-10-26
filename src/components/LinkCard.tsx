"use client";

import Link from "next/link";
import type { LinkItem } from "@/data/profile";
import { trackClick } from "@/lib/trackClick";

export const cardClassName =
  "group flex w-full items-center gap-4 rounded-2xl border border-line bg-surface px-4 py-3.5 text-left shadow-sm shadow-slate-900/5 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg hover:shadow-emerald-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0";

// 아이콘 + 제목 + 화살표로 구성된 카드 내부. PopupCard와 공유
export function CardContent({ link }: { link: LinkItem }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-emerald-500/15 to-cyan-500/15 text-xl"
      >
        {link.icon ?? "🔗"}
      </span>
      <span className="flex-1 break-keep text-[15px] font-semibold">{link.title}</span>
      <span
        aria-hidden="true"
        className="text-lg text-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
      >
        →
      </span>
    </>
  );
}

export default function LinkCard({
  link,
}: {
  link: Extract<LinkItem, { kind: "link" }>;
}) {
  // 사이트 내부 경로는 같은 탭에서 클라이언트 이동
  if (link.url.startsWith("/")) {
    return (
      <Link href={link.url} onClick={() => trackClick(link.id)} className={cardClassName}>
        <CardContent link={link} />
      </Link>
    );
  }

  // mailto: 등은 새 탭이 아니라 현재 창에서 처리
  const external = /^https?:\/\//.test(link.url);
  return (
    <a
      href={link.url}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      onClick={() => trackClick(link.id)}
      className={cardClassName}
    >
      <CardContent link={link} />
    </a>
  );
}
