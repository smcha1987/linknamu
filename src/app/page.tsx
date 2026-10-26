import LinkList from "@/components/LinkList";
import ProfileHeader from "@/components/ProfileHeader";
import { links, profile } from "@/data/profile";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-10 px-4 py-14">
      <ProfileHeader profile={profile} />
      <LinkList links={links} />
      <footer className="mt-auto text-center text-xs text-muted">© 링크나무</footer>
    </main>
  );
}
