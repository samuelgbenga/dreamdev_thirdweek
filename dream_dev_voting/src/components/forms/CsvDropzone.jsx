import { useState, useRef } from 'react';

export default function CsvDropzone({ onFile, file }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  function onChange(e) {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith('.csv')) onFile(f);
  }

  function onDrop(e) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.endsWith('.csv')) onFile(f);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      style={{
        border: `1.5px dashed ${drag ? 'var(--green)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius)',
        padding: 24,
        textAlign: 'center',
        background: drag ? 'var(--green-soft)' : 'var(--bg)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <input ref={inputRef} type="file" accept=".csv" onChange={onChange} style={{ display: 'none' }} />
      {file ? (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>{file.name}</div>
          <div className="muted" style={{ fontSize: 12 }}>{(file.size / 1024).toFixed(1)} KB · Click to replace</div>
        </div>
      ) : (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>Drop a .csv file here</div>
          <div className="muted" style={{ fontSize: 13 }}>or click to browse</div>
        </div>
      )}
    </div>
  );
}
