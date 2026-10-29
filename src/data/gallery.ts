import type { StaticImageData } from "next/image";
import photo01 from "@/assets/gallery/photo-01.jpg";
import photo02 from "@/assets/gallery/photo-02.jpg";
import photo03 from "@/assets/gallery/photo-03.jpg";
import photo04 from "@/assets/gallery/photo-04.jpg";
import photo05 from "@/assets/gallery/photo-05.jpg";
import photo06 from "@/assets/gallery/photo-06.jpg";
import photo07 from "@/assets/gallery/photo-07.jpg";

export type GalleryPhoto = {
  src: StaticImageData;
  alt: string;
};

// 정적 import라 크기와 흐림 미리보기(blur placeholder)가 빌드 시 자동 생성됨
// 사진을 추가하려면 src/assets/gallery/ 에 파일을 넣고 여기에 한 줄 추가
export const galleryPhotos: GalleryPhoto[] = [
  { src: photo01, alt: "놀이 천막 아래에서 활짝 웃는 아영이" },
  { src: photo02, alt: "아영이 사진 2" },
  { src: photo03, alt: "아영이 사진 3" },
  { src: photo04, alt: "아영이 사진 4" },
  { src: photo05, alt: "아영이 사진 5" },
  { src: photo06, alt: "주방놀이 장난감 앞에 앉아 있는 아영이" },
  { src: photo07, alt: "식당에서 맛있게 먹고 있는 아영이" },
];
