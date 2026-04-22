import { Info, Warn } from './Icons';

export default function Alert({ tone = 'info', children, icon }) {
  const cls = `alert ${tone === 'amber' ? 'alert-amber' : tone === 'danger' ? 'alert-danger' : 'alert-info'}`;
  const defaultIcon = tone === 'danger' ? <Warn /> : <Info />;
  return (
    <div className={cls}>
      <span className="alert-icon">{icon ?? defaultIcon}</span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
