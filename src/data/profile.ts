export type Profile = {
  name: string;
  bio: string;
  image: string;
};

export type LinkItem = {
  id: string;
  title: string;
  url: string;
};

export const profile: Profile = {
  name: "김클로",
  bio: "세계 최강 바이브코더",
  image: "/profile.svg",
};

export const links: LinkItem[] = [
  { id: "github", title: "GitHub", url: "https://github.com" },
  { id: "linkedin", title: "LinkedIn", url: "https://www.linkedin.com" },
  { id: "blog", title: "Blog", url: "https://velog.io" },
];

export function isLinkId(id: unknown): id is string {
  return typeof id === "string" && links.some((link) => link.id === id);
}
