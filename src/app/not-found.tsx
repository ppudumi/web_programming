import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="card notice">
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>주소를 다시 확인해 주세요.</p>
      <Link href="/" className="button primary">홈으로</Link>
    </div>
  )
}
