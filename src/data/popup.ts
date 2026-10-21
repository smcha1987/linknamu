export type PopupContent = {
  title: string;
  tags: string[];
  description: string;
  sections: { heading: string; items: string[] }[];
  references: { label: string; url: string }[];
  images: { src: string; alt: string; width: number; height: number }[];
};

export const lguBoraPopup: PopupContent = {
  title: "지연이의 LG U+ 통신확인 요청",
  tags: ["프로모션", "일반"],
  description:
    "유플러스 Bora 카드는 LG유플러스 인터넷 요금 자동이체 시 전월 실적에 따라 할인 또는 캐시백을 제공하는 신한카드 제휴 상품입니다.",
  sections: [
    {
      heading: "카드 주요 특징",
      items: [
        "LG U+ Bora 신한카드 Big Plus는 전월 실적 40만원 이상 시 21,000원(24개월 캐시백 기준) 혜택을 제공하는 것으로 안내됩니다.",
        "혜택 방식은 청구할인이 아닌 계좌로 현금이 입금되는 캐시백 방식입니다.",
        "신한카드 Bora는 Master(해외겸용) 카드로 발급해야 한다는 안내가 있습니다.",
      ],
    },
    {
      heading: "혜택 및 실적 정보",
      items: [
        "전월 실적 40만원 이상 시 월 21,000원(24개월 캐시백), 80만원 이상 시 월 23,000원(24개월 캐시백) 혜택이 언급됩니다.",
        "연회비는 국내전용 22,000원, 해외겸용 25,000원입니다.",
        "주유(현대오일뱅크 리터당 40P 적립), 영화(CGV, 메가박스 최대 3,000원 할인), 테마파크(롯데월드, 서울랜드 할인) 등의 부가 혜택이 있습니다.",
      ],
    },
  ],
  references: [
    {
      label: "카드바라 · 신한카드 LG U+ Bora Big Plus",
      url: "https://cardbara.com/cards/shinhancard-lg-u-bora-big-plus-ACACD8/",
    },
    {
      label: "텔레네이션 · LG 제휴카드 완전 총정리",
      url: "https://telenation.co.kr/product/lg-%EC%A0%9C%ED%9C%B4%EC%B9%B4%EB%93%9C-%EC%99%84%EC%A0%84-%EC%B4%9D%EC%A0%95%EB%A6%AC/192/",
    },
  ],
  images: [
    {
      src: "/popup/bora-compare-1.png",
      alt: "신한 Bora와 LG U+ 우리카드 핵심 비교표",
      width: 780,
      height: 773,
    },
    {
      src: "/popup/bora-compare-2.png",
      alt: "2026년 10월 신규발급 프로모션 및 아파트 관리비 비교표",
      width: 826,
      height: 723,
    },
    {
      src: "/popup/bora-compare-3.png",
      alt: "놀이공원, 영화, 주유 부가 혜택 안내",
      width: 940,
      height: 642,
    },
  ],
};
