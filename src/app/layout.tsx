import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: '익명 게시판',
  description: 'Next.js App Router 익명 게시판 실습',
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="logo">익명 게시판</Link>
            <nav className="nav">
              <Link href="/posts">목록</Link>
              <Link href="/posts/new" className="button primary small">글쓰기</Link>
            </nav>
          </div>
        </header>
        <main className="container main">{children}</main>
        <footer className="site-footer">
          <div className="container">웹프로그래밍 실습 · Anonymous Message Board</div>
        </footer>
      </body>
    </html>
  )
}
