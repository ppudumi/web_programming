import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchPost } from '@/src/services/postApi'
import { formatDate } from '@/src/lib/format'
import PostActions from '@/src/components/PostActions'

export const dynamic = 'force-dynamic'

type Params = Promise<{ id: string }>

export default async function PostDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const post = await fetchPost(id) // 조회수 1 증가
  if (!post) notFound()

  return (
    <article className="card">
      <h1 className="post-title">{post.title}</h1>
      <div className="post-meta">
        <span>작성자 {post.author}</span>
        <span>작성일 {formatDate(post.createdAt)}</span>
        <span>조회 {post.views}</span>
        <span>No. {post.id}</span>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="detail-footer">
        <Link href="/posts" className="button">목록으로</Link>
        <PostActions id={post.id} />
      </div>
    </article>
  )
}
