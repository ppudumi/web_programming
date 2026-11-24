export default function Loading() {
  return (
    <div className="card" aria-busy="true" aria-live="polite">
      <p className="muted" style={{ marginTop: 0 }}>불러오는 중…</p>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="skeleton" style={{ width: `${90 - i * 8}%` }} />
      ))}
    </div>
  )
}
