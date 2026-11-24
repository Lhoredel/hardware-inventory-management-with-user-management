export default function StatCard({ label, value, note, tone = 'blue' }) {
  return <article className={`stat-card stat-${tone}`}>
    <span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}
  </article>;
}
