import Link from 'next/link'

export default function PostNotFound() {
  return (
    <div className="card notice">
      <h1>게시글을 찾을 수 없습니다</h1>
      <p>삭제되었거나 존재하지 않는 글입니다.</p>
      <Link href="/posts" className="button primary">목록으로</Link>
    </div>
  )
}
