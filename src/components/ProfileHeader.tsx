import Image from "next/image";
import type { Profile } from "@/data/profile";

export default function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="flex flex-col items-center text-center">
      <Image
        src={profile.image}
        alt={`${profile.name} 프로필 사진`}
        width={144}
        height={144}
        priority
        className="h-36 w-36 rounded-full border border-black/10 object-cover dark:border-white/15"
      />
      <h1 className="mt-5 text-2xl font-bold">{profile.name}</h1>
      <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
        {profile.bio}
      </p>
    </header>
  );
}
