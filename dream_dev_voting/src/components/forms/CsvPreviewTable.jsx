export default function CsvPreviewTable({ rows = [], headers }) {
  if (!rows || rows.length === 0) return null;
  const cols = headers || Object.keys(rows[0]);
  return (
    <div style={{ overflow: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
      <table className="table">
        <thead>
          <tr>{cols.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map(h => <td key={h} className="mono" style={{ fontSize: 12 }}>{r[h]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
