import { lguBoraPopup, type PopupContent } from "./popup";

export type Profile = {
  name: string;
  bio: string;
  image: string;
};

// kind: "link"는 외부 링크로 이동, "popup"은 클릭 시 팝업 표시
// icon은 카드 왼쪽에 표시되는 이모지
export type LinkItem =
  | { id: string; title: string; icon?: string; kind: "link"; url: string }
  | { id: string; title: string; icon?: string; kind: "popup"; popup: PopupContent };

export const profile: Profile = {
  name: "아영이네",
  bio: "아영이네 사이트에 놀러오신걸 환영합니다.",
  image: "/profile.svg",
};

export const links: LinkItem[] = [
  {
    id: "lgu-bora",
    kind: "popup",
    icon: "📱",
    title: "지연이의 LG U+ 통신확인 요청",
    popup: lguBoraPopup,
  },
  { id: "schedule", kind: "link", icon: "📅", title: "아영이네의 일정관리", url: "/calendar" },
  { id: "email", kind: "link", icon: "✉️", title: "이메일", url: "mailto:hello@example.com" },
];

export function isLinkId(id: unknown): id is string {
  return typeof id === "string" && links.some((link) => link.id === id);
}
