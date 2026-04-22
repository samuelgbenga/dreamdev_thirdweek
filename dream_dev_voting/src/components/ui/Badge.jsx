export default function Badge({ tone = 'default', children, dot }) {
  const cls = [
    'badge',
    tone === 'green' && 'badge-green',
    tone === 'amber' && 'badge-amber',
    tone === 'red' && 'badge-red',
  ].filter(Boolean).join(' ');

  return (
    <span className={cls}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}
