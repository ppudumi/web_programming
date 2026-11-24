'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deletePost } from '@/src/services/postApi'
import { getEditToken, removeEditToken } from '@/src/lib/editTokens'

/** 상세 화면의 수정/삭제 버튼 */
export default function PostActions({ id }: { id: number }) {
  const router = useRouter()
  const [hasToken, setHasToken] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setHasToken(Boolean(getEditToken(id)))
  }, [id])

  async function handleDelete() {
    if (pending) return
    let token = getEditToken(id)
    if (!token) {
      token = window.prompt('이 브라우저에 저장된 관리 토큰이 없습니다.\n글 작성 시 받은 관리 토큰을 입력하세요.')?.trim() || null
      if (!token) return
    }
    if (!window.confirm('정말 이 글을 삭제할까요? 삭제한 글은 되돌릴 수 없습니다.')) return

    setPending(true)
    setError(null)
    try {
      await deletePost(id, token)
      removeEditToken(id)
      router.push('/posts')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제에 실패했습니다.')
      setPending(false)
    }
  }

  return (
    <div>
      <div className="actions">
        <Link href={`/posts/${id}/edit`} className="button">수정</Link>
        <button type="button" className="button danger" onClick={handleDelete} disabled={pending}>
          {pending ? '삭제 중…' : '삭제'}
        </button>
      </div>
      {!hasToken && <p className="muted" style={{ fontSize: '0.85rem', margin: '6px 0 0' }}>다른 브라우저에서 쓴 글은 관리 토큰이 필요합니다.</p>}
      {error && <p className="error-text" role="alert">{error}</p>}
    </div>
  )
}
