export type Profile = {
  name: string;
  bio: string;
  image: string;
};

// kind: "link"는 외부 링크로 이동, "gallery"는 클릭 시 사진 갤러리 팝업 표시
// icon은 카드 왼쪽에 표시되는 이모지
export type LinkItem =
  | { id: string; title: string; icon?: string; kind: "link"; url: string }
  | { id: string; title: string; icon?: string; kind: "gallery" };

export const profile: Profile = {
  name: "아영이네",
  bio: "아영이네 사이트에 놀러오신걸 환영합니다.",
  image: "/profile.jpg",
};

export const links: LinkItem[] = [
  { id: "photo-studio", kind: "gallery", icon: "📸", title: "아영이네의 사진관" },
  { id: "schedule", kind: "link", icon: "📅", title: "아영이네의 일정관리", url: "/calendar" },
  { id: "it-study", kind: "link", icon: "💻", title: "중요 메모 작성", url: "/memo" },
];

export function isLinkId(id: unknown): id is string {
  return typeof id === "string" && links.some((link) => link.id === id);
}
