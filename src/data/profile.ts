import { lguBoraPopup, type PopupContent } from "./popup";

export type Profile = {
  name: string;
  bio: string;
  image: string;
};

// kind: "link"는 외부 링크로 이동, "popup"은 클릭 시 팝업 표시
export type LinkItem =
  | { id: string; title: string; kind: "link"; url: string }
  | { id: string; title: string; kind: "popup"; popup: PopupContent };

export const profile: Profile = {
  name: "김개발",
  bio: "풀스택 개발자 | 요즘에는 AI 개발에 관심이 많아요",
  image: "/profile.jpg",
};

export const links: LinkItem[] = [
  {
    id: "lgu-bora",
    kind: "popup",
    title: "지연이의 LG U+ 통신확인 요청",
    popup: lguBoraPopup,
  },
  { id: "blog", kind: "link", title: "블로그", url: "https://velog.io" },
  { id: "email", kind: "link", title: "이메일", url: "mailto:hello@example.com" },
];

export function isLinkId(id: unknown): id is string {
  return typeof id === "string" && links.some((link) => link.id === id);
}
