import Link from 'next/link'

export default function Home() {
  return (
    <section className="hero card">
      <h1>익명 게시판</h1>
      <p>로그인 없이 누구나 글을 쓸 수 있습니다. 글을 쓴 브라우저에서만 수정·삭제할 수 있어요.</p>
      <div className="actions">
        <Link href="/posts" className="button">게시글 목록</Link>
        <Link href="/posts/new" className="button primary">글쓰기</Link>
      </div>
    </section>
  )
}
