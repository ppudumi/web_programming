/** UTC ISO 문자열을 한국 시간으로 표시합니다. (서버/클라이언트 결과가 같도록 시간대를 고정) */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}
