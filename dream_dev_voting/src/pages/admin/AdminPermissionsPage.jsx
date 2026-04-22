import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { electorateService } from '../../services/electorateService';
import { PERMISSION } from '../../constants/enums';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';

function PermForm({ title, variant, onSubmit }) {
  const [userId, setUserId] = useState('');
  const [perm, setPerm] = useState(PERMISSION[0]);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      await onSubmit({ userId, permission: perm });
      setUserId('');
    } catch {}
    finally { setLoading(false); }
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 16 }}>{title}</h3>
      <form onSubmit={submit} className="stack">
        <Field label="User ID" hint="Voter ID or Electorate ID">
          <Input value={userId} onChange={e => setUserId(e.target.value)} placeholder="NIG-LA-… or ELECTORATE-…" />
        </Field>
        <Field label="Permission">
          <Select value={perm} onChange={e => setPerm(e.target.value)}>
            {PERMISSION.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>
        </Field>
        <Button variant={variant} type="submit" fullWidth disabled={loading}>
          {loading ? 'Submitting…' : title}
        </Button>
      </form>
    </div>
  );
}

export default function AdminPermissionsPage() {
  const { electorateId } = useAdmin();
  const [log, setLog] = useState([]);

  function record(entry) {
    setLog(prev => [{ ...entry, ts: new Date().toLocaleTimeString() }, ...prev]);
  }

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div>
        <div className="eyebrow">Manage</div>
        <h2 style={{ marginTop: 8 }}>Permissions</h2>
      </div>

      <div className="grid grid-2">
        <PermForm
          title="Assign permission"
          variant="primary"
          onSubmit={data => {
            record({ action: 'assigned', ...data });
            return electorateService.assignPermission({ ...data, assignerElectorateId: electorateId });
          }}
        />
        <PermForm
          title="Remove permission"
          variant="secondary"
          onSubmit={data => {
            record({ action: 'removed', ...data });
            return electorateService.removePermission({ ...data, assignerElectorateId: electorateId });
          }}
        />
      </div>

      <div className="card">
        <div className="card-head"><h3>Recent activity</h3></div>
        {log.length === 0 && (
          <div className="muted" style={{ textAlign: 'center', padding: 20 }}>No activity yet in this session.</div>
        )}
        {log.map((l, i) => (
          <div key={i} className="row-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
            <div className="row" style={{ gap: 10 }}>
              <Badge tone={l.action === 'assigned' ? 'green' : 'red'}>{l.action}</Badge>
              <span className="mono" style={{ fontSize: 12 }}>{l.permission}</span>
              <span className="muted">→</span>
              <span className="mono" style={{ fontSize: 12 }}>{l.userId}</span>
            </div>
            <span className="muted" style={{ fontSize: 12 }}>{l.ts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
