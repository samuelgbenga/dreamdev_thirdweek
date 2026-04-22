export default function Field({ label, hint, error, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {error
        ? <div className="error">{error}</div>
        : hint
        ? <div className="hint">{hint}</div>
        : null}
    </div>
  );
}
