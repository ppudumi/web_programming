// README의 API 명세를 그대로 옮긴 타입 계약입니다.

/** 목록에서 사용하는 게시글 요약 */
export type PostSummary = {
  id: number
  title: string
  author: string // 항상 "익명"
  createdAt: string // UTC ISO 문자열
  views: number
}

/** 상세 게시글 (요약 + 본문) */
export type Post = PostSummary & {
  content: string
}

/** GET /api/posts 응답 */
export type PostListResponse = {
  posts: PostSummary[]
  total: number
  page: number
  size: number
}

/** POST /api/posts 응답 */
export type CreatePostResponse = {
  post: Post
  editToken: string
}

/** POST, PATCH 요청 본문 */
export type PostInput = {
  title: string
  content: string
}

/** 오류 응답 본문 */
export type ApiErrorBody = {
  message: string
}

/** 서버와 동일한 입력 제한 */
export const TITLE_MAX = 100
export const CONTENT_MAX = 5000
export const PAGE_SIZE = 10
