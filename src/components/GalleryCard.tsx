"use client";

import { useState } from "react";
import type { LinkItem } from "@/data/profile";
import { trackClick } from "@/lib/trackClick";
import { CardContent, cardClassName } from "./LinkCard";
import Modal from "./Modal";
import PhotoGallery from "./PhotoGallery";

export default function GalleryCard({
  link,
}: {
  link: Extract<LinkItem, { kind: "gallery" }>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          trackClick(link.id);
          setOpen(true);
        }}
        className={`${cardClassName} cursor-pointer`}
      >
        <CardContent link={link} />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={link.title}>
        {/* 열 때마다 새로 마운트되어 등장 애니메이션이 다시 재생됨 */}
        {open && <PhotoGallery />}
      </Modal>
    </>
  );
}
