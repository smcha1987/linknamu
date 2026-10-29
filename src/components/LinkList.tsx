import type { LinkItem } from "@/data/profile";
import GalleryCard from "./GalleryCard";
import LinkCard from "./LinkCard";

export default function LinkList({ links }: { links: LinkItem[] }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {links.map((link) => (
        <li key={link.id}>
          {link.kind === "gallery" ? (
            <GalleryCard link={link} />
          ) : (
            <LinkCard link={link} />
          )}
        </li>
      ))}
    </ul>
  );
}
