"use client";

import { useState } from "react";
import type { LinkItem } from "@/data/profile";
import { trackClick } from "@/lib/trackClick";
import { cardClassName } from "./LinkCard";
import Modal from "./Modal";
import PopupBody from "./PopupBody";

export default function PopupCard({
  link,
}: {
  link: Extract<LinkItem, { kind: "popup" }>;
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
        {link.title}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={link.popup.title}>
        <PopupBody content={link.popup} />
      </Modal>
    </>
  );
}
