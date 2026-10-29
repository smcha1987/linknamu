export type BgmTrack = {
  title: string;
  src: string;
};

// 배열 순서대로 재생하고, 마지막 곡이 끝나면 처음으로 돌아감
// 음원 파일은 public/bgm/ 폴더에 아래 파일명으로 넣어야 함
export const bgmTracks: BgmTrack[] = [
  { title: "세상은 놀이터", src: "/bgm/세상은 놀이터.mp3" },
  { title: "춤을 추며 콩콩콩", src: "/bgm/춤을 추며 콩콩콩.mp3" },
  { title: "색칠 놀이", src: "/bgm/색칠 놀이.mp3" },
  { title: "나무야", src: "/bgm/나무야.mp3" },
];
