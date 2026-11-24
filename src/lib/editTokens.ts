// 작성 응답의 editToken을 브라우저(localStorage)에 글 ID별로 보관합니다.
// 클라이언트 컴포넌트에서만 호출하세요.

const KEY = 'board:editTokens'

function readAll(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function writeAll(tokens: Record<string, string>) {
  localStorage.setItem(KEY, JSON.stringify(tokens))
}

export function getEditToken(id: number | string): string | null {
  return readAll()[String(id)] ?? null
}

export function saveEditToken(id: number | string, token: string) {
  writeAll({ ...readAll(), [String(id)]: token })
}

export function removeEditToken(id: number | string) {
  const tokens = readAll()
  delete tokens[String(id)]
  writeAll(tokens)
}
