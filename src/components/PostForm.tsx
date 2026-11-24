'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createPost, updatePost } from '@/src/services/postApi'
import { getEditToken, saveEditToken } from '@/src/lib/editTokens'
import { CONTENT_MAX, TITLE_MAX, type Post } from '@/src/types/post'

type Props = { mode: 'create' } | { mode: 'edit'; post: Post }

export default function PostForm(props: Props) {
  const router = useRouter()
  const editing = props.mode === 'edit' ? props.post : null

  const [title, setTitle] = useState(editing?.title ?? '')
  const [content, setContent] = useState(editing?.content ?? '')
  const [token, setToken] = useState('')
  const [hasStoredToken, setHasStoredToken] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 수정 모드: 이 브라우저에 저장된 관리 토큰을 불러옵니다. (localStorage는 마운트 후에만 접근)
  useEffect(() => {
    if (!editing) return
    const stored = getEditToken(editing.id)
    setToken(stored ?? '')
    setHasStoredToken(Boolean(stored))
  }, [editing])

  const titleLength = title.trim().length
  const contentLength = content.trim().length

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const input = { title: title.trim(), content: content.trim() }
    if (!input.title || input.title.length > TITLE_MAX) return setError(`제목은 1~${TITLE_MAX}자로 입력하세요.`)
    if (!input.content || input.content.length > CONTENT_MAX) return setError(`본문은 1~${CONTENT_MAX}자로 입력하세요.`)
    if (editing && !token.trim()) return setError('관리 토큰이 필요합니다.')

    setPending(true)
    setError(null)
    try {
      if (editing) {
        const editToken = token.trim()
        await updatePost(editing.id, input, editToken)
        saveEditToken(editing.id, editToken)
        router.push(`/posts/${editing.id}`)
      } else {
        const { post, editToken } = await createPost(input)
        saveEditToken(post.id, editToken) // 토큰은 이때 한 번만 발급됩니다.
        router.push(`/posts/${post.id}`)
      }
      // 상세 페이지는 동적 렌더링이라 이동 시 항상 새로 조회됩니다.
      // 여기서 router.refresh()를 또 부르면 상세 페이지를 한 번 더 요청해 조회수가 2 증가하므로 호출하지 않습니다.
      // 성공 시에는 이동이 끝날 때까지 버튼을 계속 비활성화해 둡니다.
    } catch (err) {
      setError(err instanceof Error ? err.message : '요청에 실패했습니다.')
      setPending(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="title">제목</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={pending} placeholder="제목을 입력하세요" autoFocus />
        <div className="field-help">
          <span>앞뒤 공백은 제거됩니다.</span>
          <span className={titleLength > TITLE_MAX ? 'over' : ''}>{titleLength} / {TITLE_MAX}</span>
        </div>
      </div>

      <div className="field">
        <label htmlFor="content">본문</label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} disabled={pending} placeholder="내용을 입력하세요" />
        <div className="field-help">
          <span>작성자는 &lsquo;익명&rsquo;으로 표시됩니다.</span>
          <span className={contentLength > CONTENT_MAX ? 'over' : ''}>{contentLength} / {CONTENT_MAX}</span>
        </div>
      </div>

      {editing && (
        <div className="field">
          <label htmlFor="token">관리 토큰</label>
          <input id="token" type="password" value={token} onChange={(e) => setToken(e.target.value)} disabled={pending} autoComplete="off" spellCheck={false} />
          <div className="field-help">
            <span>{hasStoredToken ? '이 브라우저에 저장된 토큰을 불러왔습니다.' : '이 브라우저에 저장된 토큰이 없습니다. 글 작성 시 받은 토큰을 입력하세요.'}</span>
          </div>
        </div>
      )}

      {error && <p className="error-text" role="alert">{error}</p>}

      <div className="form-actions">
        <Link href={editing ? `/posts/${editing.id}` : '/posts'} className="button" prefetch={false}>취소</Link>
        <button type="submit" className="button primary" disabled={pending}>
          {pending ? (editing ? '수정 중…' : '등록 중…') : editing ? '수정하기' : '등록하기'}
        </button>
      </div>
    </form>
  )
}
