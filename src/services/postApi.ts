import type {
  ApiErrorBody,
  CreatePostResponse,
  Post,
  PostInput,
  PostListResponse,
} from '@/src/types/post'

/** API가 {message} 오류를 돌려줬을 때 사용하는 에러 */
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

async function toApiError(response: Response) {
  const body = (await response.json().catch(() => null)) as ApiErrorBody | null
  return new ApiError(body?.message ?? `요청에 실패했습니다. (HTTP ${response.status})`, response.status)
}

/* ------------------------------------------------------------------ */
/* Server Component 전용: API_BASE_URL 기준 절대 URL로 조회합니다.      */
/* ------------------------------------------------------------------ */

function serverUrl(path: string) {
  const base = process.env.API_BASE_URL
  if (!base) throw new Error('API_BASE_URL이 설정되지 않았습니다. .env.local을 확인하세요.')
  return new URL(path, base).toString()
}

export async function fetchPosts({ q = '', page = 1, size = 10 }: { q?: string; page?: number; size?: number }) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (q) params.set('q', q)
  const response = await fetch(serverUrl(`/api/posts?${params}`), { cache: 'no-store' })
  if (!response.ok) throw await toApiError(response)
  return (await response.json()) as PostListResponse
}

/**
 * 상세 조회. countView가 true면 조회수가 1 증가합니다.
 * 수정 폼처럼 조회수를 올리면 안 되는 곳에서는 countView: false (?view=0)를 사용하세요.
 * 글이 없으면 null을 돌려줍니다.
 */
export async function fetchPost(id: string, { countView = true }: { countView?: boolean } = {}) {
  const query = countView ? '' : '?view=0'
  const response = await fetch(serverUrl(`/api/posts/${encodeURIComponent(id)}${query}`), { cache: 'no-store' })
  if (response.status === 404) return null
  if (!response.ok) throw await toApiError(response)
  return (await response.json()) as Post
}

/* ------------------------------------------------------------------ */
/* Client Component 전용: 같은 출처의 /api/posts로 요청합니다.          */
/* ------------------------------------------------------------------ */

const json = { 'Content-Type': 'application/json' }
const bearer = (token: string) => ({ Authorization: `Bearer ${token}` })

export async function createPost(input: PostInput) {
  const response = await fetch('/api/posts', { method: 'POST', headers: json, body: JSON.stringify(input) })
  if (!response.ok) throw await toApiError(response)
  return (await response.json()) as CreatePostResponse
}

export async function updatePost(id: number, input: PostInput, token: string) {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PATCH',
    headers: { ...json, ...bearer(token) },
    body: JSON.stringify(input),
  })
  if (!response.ok) throw await toApiError(response)
  return (await response.json()) as Post
}

export async function deletePost(id: number, token: string) {
  const response = await fetch(`/api/posts/${id}`, { method: 'DELETE', headers: bearer(token) })
  // 성공(204)은 빈 본문이므로 JSON 파싱을 하지 않습니다.
  if (!response.ok) throw await toApiError(response)
}
