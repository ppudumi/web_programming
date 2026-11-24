import PostForm from '@/src/components/PostForm'

export const metadata = { title: '글쓰기 · 익명 게시판' }

export default function NewPostPage() {
  return (
    <>
      <h1>글쓰기</h1>
      <div className="card">
        <PostForm mode="create" />
      </div>
    </>
  )
}
