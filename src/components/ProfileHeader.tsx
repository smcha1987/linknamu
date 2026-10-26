import Image from "next/image";
import type { Profile } from "@/data/profile";

export default function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="rounded-full bg-linear-to-tr from-accent via-accent-2 to-indigo-500 p-1 shadow-xl shadow-emerald-500/20">
        <Image
          src={profile.image}
          alt={`${profile.name} 프로필 사진`}
          width={128}
          height={128}
          priority
          // next/image는 기본적으로 SVG 최적화를 막으므로 원본 그대로 사용
          unoptimized={profile.image.endsWith(".svg")}
          className="h-32 w-32 rounded-full border-4 border-surface-strong bg-surface-strong object-cover"
        />
      </div>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight">{profile.name}</h1>
      <p className="mt-1.5 break-keep text-[15px] text-muted">{profile.bio}</p>
    </header>
  );
}
