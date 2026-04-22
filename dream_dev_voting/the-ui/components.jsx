// Shared primitive components for Dream Dev Vote

// Use React.useState etc. directly to avoid scope collisions across Babel scripts

// ------- Icons (small inline set) -------
const Icon = {
  Check: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5L6.5 12L13 4.5" />
    </svg>
  ),
  ArrowRight: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  ),
  ArrowLeft: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 8H3M7 4l-4 4 4 4" />
    </svg>
  ),
  Copy: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="9" height="9" rx="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
    </svg>
  ),
  Info: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7.5v4M8 5v.5" strokeLinecap="round" />
    </svg>
  ),
  Warn: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M8 1.5L15 14H1L8 1.5z" strokeLinejoin="round" />
      <path d="M8 6v3.5M8 11.5v.5" strokeLinecap="round" />
    </svg>
  ),
  Shield: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M8 1.5l6 2.5v4c0 3.5-2.5 6-6 6.5-3.5-.5-6-3-6-6.5V4l6-2.5z" />
      <path d="M5.5 8.5L7 10l3.5-3.5" strokeLinecap="round" />
    </svg>
  ),
  Search: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  ),
  Calendar: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3.5" width="12" height="10.5" rx="1.5" />
      <path d="M2 6.5h12M5 2v3M11 2v3" strokeLinecap="round" />
    </svg>
  ),
  MapPin: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M8 14s5-4.5 5-8.5A5 5 0 0 0 3 5.5c0 4 5 8.5 5 8.5z" />
      <circle cx="8" cy="5.5" r="1.5" />
    </svg>
  ),
};

// ------- Button -------
function Button({ variant = 'primary', size, children, onClick, disabled, type = 'button', icon, trailingIcon, fullWidth, ...rest }) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'lg' && 'btn-lg',
    size === 'sm' && 'btn-sm',
    fullWidth && 'w-full',
  ].filter(Boolean).join(' ');
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} style={fullWidth ? { width: '100%' } : undefined} {...rest}>
      {icon}
      {children}
      {trailingIcon}
    </button>
  );
}

// ------- Input / Select / Field -------
function Field({ label, hint, error, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {error ? <div className="error">{error}</div> : hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

function Input(props) {
  return <input className="input" {...props} />;
}

function Select({ children, ...props }) {
  return <select className="select" {...props}>{children}</select>;
}

// ------- Badge -------
function Badge({ tone = 'default', children, dot }) {
  const cls = `badge ${tone === 'green' ? 'badge-green' : tone === 'amber' ? 'badge-amber' : tone === 'red' ? 'badge-red' : ''}`;
  return (
    <span className={cls}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

// ------- Alert -------
function Alert({ tone = 'info', children, icon }) {
  const cls = `alert ${tone === 'amber' ? 'alert-amber' : tone === 'danger' ? 'alert-danger' : 'alert-info'}`;
  const defaultIcon = tone === 'danger' ? <Icon.Warn /> : tone === 'amber' ? <Icon.Info /> : <Icon.Info />;
  return (
    <div className={cls}>
      <span className="alert-icon">{icon ?? defaultIcon}</span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

// ------- Modal -------
function Modal({ open, onClose, title, children, footer }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {title && <div className="modal-head"><h3>{title}</h3></div>}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ------- Countdown -------
function Countdown({ target }) {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = new Date(target) - now;
  if (diff <= 0) return <span>Voting is live</span>;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const pad = n => String(n).padStart(2, '0');
  return <span className="hero-countdown-display">{days}d {pad(hours)}h {pad(mins)}m {pad(secs)}s</span>;
}

// ------- Stepper -------
function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className={`stepper-step ${i === current ? 'active' : i < current ? 'done' : ''}`}>
            <div className="stepper-dot">{i < current ? <Icon.Check size={11} /> : i + 1}</div>
            <span>{s}</span>
          </div>
          {i < steps.length - 1 && <div className="stepper-line" />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ------- Candidate avatar helper -------
function initialsOf(name) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

Object.assign(window, {
  Icon, Button, Field, Input, Select, Badge, Alert, Modal, Countdown, Stepper, initialsOf
});
