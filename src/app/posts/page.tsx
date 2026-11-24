import Link from 'next/link'
import { fetchPosts } from '@/src/services/postApi'
import { PAGE_SIZE } from '@/src/types/post'
import { formatDate } from '@/src/lib/format'
import SearchForm from '@/src/components/SearchForm'
import Pagination from '@/src/components/Pagination'

// 빌드 시 API 서버가 없어도 되도록 요청마다 동적으로 렌더링합니다.
export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ q?: string | string[]; page?: string | string[] }>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ''

export default async function PostsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const q = first(params.q).trim()
  const requested = Number(first(params.page) || 1)
  const page = Number.isSafeInteger(requested) && requested >= 1 ? requested : 1

  const { posts, total, size } = await fetchPosts({ q, page, size: PAGE_SIZE })
  const totalPages = Math.max(1, Math.ceil(total / size))

  return (
    <>
      <div className="page-head">
        <h1>게시글 목록</h1>
        <Link href="/posts/new" className="button primary">글쓰기</Link>
      </div>

      <SearchForm q={q} />
      {q && (
        <p className="search-info">
          &lsquo;{q}&rsquo; 검색 결과 {total}건 · <Link href="/posts">전체 보기</Link>
        </p>
      )}

      {posts.length === 0 ? (
        <div className="card notice">
          {total > 0 ? (
            <p>이 페이지에는 게시글이 없습니다. <Link href={q ? `/posts?q=${encodeURIComponent(q)}` : '/posts'}>첫 페이지로</Link></p>
          ) : q ? (
            <p>&lsquo;{q}&rsquo;에 해당하는 게시글이 없습니다.</p>
          ) : (
            <p>아직 게시글이 없습니다. 첫 글을 작성해 보세요!<br /><br /><Link href="/posts/new" className="button primary">글쓰기</Link></p>
          )}
        </div>
      ) : (
        <table className="post-table">
          <thead>
            <tr>
              <th className="num">번호</th>
              <th>제목</th>
              <th className="author">작성자</th>
              <th className="date">작성일</th>
              <th className="views">조회</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="num">{post.id}</td>
                <td className="title">
                  {/* 상세 조회 시 조회수가 올라가므로 prefetch를 끕니다. */}
                  <Link href={`/posts/${post.id}`} prefetch={false}>{post.title}</Link>
                </td>
                <td className="author">{post.author}</td>
                <td className="date">{formatDate(post.createdAt)}</td>
                <td className="views">{post.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination page={page} totalPages={totalPages} q={q} />
    </>
  )
}
