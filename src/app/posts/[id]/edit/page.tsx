import { notFound } from 'next/navigation'
import { fetchPost } from '@/src/services/postApi'
import PostForm from '@/src/components/PostForm'

export const dynamic = 'force-dynamic'

type Params = Promise<{ id: string }>

export default async function EditPostPage({ params }: { params: Params }) {
  const { id } = await params
  const post = await fetchPost(id, { countView: false }) // ?view=0: 조회수 증가 없음
  if (!post) notFound()

  return (
    <>
      <h1>글 수정</h1>
      <div className="card">
        <PostForm mode="edit" post={post} />
      </div>
    </>
  )
}
