'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function PostsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="card notice" role="alert">
      <h1>문제가 발생했습니다</h1>
      <p>게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      {process.env.NODE_ENV !== 'production' && <p className="error-text">{error.message}</p>}
      <div className="actions" style={{ justifyContent: 'center', marginTop: 16 }}>
        <button type="button" className="button primary" onClick={() => reset()}>다시 시도</button>
        <Link href="/" className="button">홈으로</Link>
      </div>
    </div>
  )
}
