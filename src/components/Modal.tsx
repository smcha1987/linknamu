"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

// 네이티브 <dialog>의 showModal()로 ESC 닫기, 포커스 가두기, 포커스 복귀를 처리
export default function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      // 패널 바깥(오버레이)을 클릭하면 이벤트 대상이 dialog 자신
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="m-auto max-h-[85dvh] w-[min(100%-2rem,32rem)] overflow-hidden rounded-2xl bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/60"
    >
      <div className="flex max-h-[85dvh] flex-col">
        <header className="flex items-start gap-3 border-b border-black/10 px-5 py-4 dark:border-white/15">
          <h2 id={titleId} className="flex-1 break-keep text-lg font-bold leading-snug">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-m-1 rounded-full p-1 text-2xl leading-none text-gray-500 transition hover:bg-black/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-emerald-500 dark:hover:bg-white/10"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
      </div>
    </dialog>
  );
}
