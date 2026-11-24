import Form from 'next/form'

/** GET /posts?q=... 로 이동하는 검색 폼 (검색 시 page는 1로 초기화) */
export default function SearchForm({ q }: { q: string }) {
  return (
    <Form action="/posts" className="search" key={q}>
      <input type="search" name="q" defaultValue={q} placeholder="제목으로 검색" aria-label="제목 검색" maxLength={100} />
      <button type="submit" className="button">검색</button>
    </Form>
  )
}
