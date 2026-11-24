import Link from 'next/link'

type Props = { page: number; totalPages: number; q: string }

function href(page: number, q: string) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/posts?${query}` : '/posts'
}

/** 현재 페이지 주변 최대 5개 번호와 이전/다음 링크 */
export default function Pagination({ page, totalPages, q }: Props) {
  if (totalPages <= 1 && page <= 1) return null

  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const end = Math.min(totalPages, start + 4)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <nav className="pagination" aria-label="페이지 이동">
      {page > 1 ? <Link href={href(Math.min(page - 1, totalPages), q)}>이전</Link> : <span className="disabled">이전</span>}
      {pages.map((n) =>
        n === page ? (
          <span key={n} className="current" aria-current="page">{n}</span>
        ) : (
          <Link key={n} href={href(n, q)}>{n}</Link>
        ),
      )}
      {page < totalPages ? <Link href={href(page + 1, q)}>다음</Link> : <span className="disabled">다음</span>}
    </nav>
  )
}
