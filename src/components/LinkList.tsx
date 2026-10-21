import type { LinkItem } from "@/data/profile";
import LinkCard from "./LinkCard";
import PopupCard from "./PopupCard";

export default function LinkList({ links }: { links: LinkItem[] }) {
  return (
    <ul className="flex flex-col gap-5">
      {links.map((link) => (
        <li key={link.id}>
          {link.kind === "popup" ? (
            <PopupCard link={link} />
          ) : (
            <LinkCard link={link} />
          )}
        </li>
      ))}
    </ul>
  );
}
