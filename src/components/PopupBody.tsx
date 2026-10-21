import Image from "next/image";
import type { PopupContent } from "@/data/popup";

export default function PopupBody({ content }: { content: PopupContent }) {
  return (
    <div className="flex flex-col gap-6 break-keep text-[15px] leading-relaxed">
      <div className="flex flex-col gap-3">
        <ul className="flex flex-wrap gap-2" aria-label="분류">
          {content.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
            >
              {tag}
            </li>
          ))}
        </ul>
        <p>{content.description}</p>
      </div>

      {content.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-2">
          <h3 className="text-base font-bold">{section.heading}</h3>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-gray-400">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="flex flex-col gap-2 border-t border-black/10 pt-5 dark:border-white/15">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">참고 사이트</h3>
        <ul className="flex flex-col gap-1.5">
          {content.references.map((ref) => (
            <li key={ref.url}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline underline-offset-2 hover:text-emerald-600 dark:text-emerald-400"
              >
                {ref.label}
                <span aria-hidden="true"> ↗</span>
                <span className="sr-only"> (새 탭에서 열림)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">참고 이미지</h3>
        {content.images.map((image) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 640px) 100vw, 32rem"
            className="h-auto w-full rounded-xl border border-black/10 dark:border-white/15"
          />
        ))}
      </section>
    </div>
  );
}
