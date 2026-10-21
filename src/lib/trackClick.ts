export function trackClick(linkId: string) {
  const body = JSON.stringify({ linkId });
  // 페이지 이동 중에도 요청이 끊기지 않도록 sendBeacon 우선 사용
  if (navigator.sendBeacon?.("/api/click", body)) return;
  fetch("/api/click", { method: "POST", body, keepalive: true }).catch(() => {});
}
