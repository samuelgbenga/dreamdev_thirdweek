import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useElectorates } from '../../hooks/useElectorates';
import { electorateService } from '../../services/electorateService';
import { CITIZENSHIP_TYPE } from '../../constants/enums';
import { prettyEnum } from '../../utils/formatDate';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';

const empty = { firstName: '', lastName: '', dob: '', citizenship: 'REGISTRATION', newId: '' };

export default function AdminElectoratesPage() {
  const { electorateId } = useAdmin();
  const { electorates, loading } = useElectorates(electorateId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);

  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function create(e) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.newId) return;
    setSubmitting(true);
    try {
      await electorateService.createElectorate({
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dob,
        citizenshipType: form.citizenship,
        newElectorateId: form.newId.toUpperCase(),
      }, electorateId);
      setForm(empty);
      setShowForm(false);
    } catch {}
    finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="row-between">
        <div>
          <div className="eyebrow">Manage</div>
          <h2 style={{ marginTop: 8 }}>Electorates</h2>
        </div>
        <Button variant="primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Cancel' : '+ New electorate'}
        </Button>
      </div>

      {showForm && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Create electorate</h3>
          <form onSubmit={create} className="stack">
            <div className="grid grid-2">
              <Field label="First name"><Input value={form.firstName} onChange={upd('firstName')} /></Field>
              <Field label="Last name"><Input value={form.lastName} onChange={upd('lastName')} /></Field>
            </div>
            <div className="grid grid-2">
              <Field label="Date of birth"><Input type="date" value={form.dob} onChange={upd('dob')} /></Field>
              <Field label="Citizenship">
                <Select value={form.citizenship} onChange={upd('citizenship')}>
                  {CITIZENSHIP_TYPE.map(c => <option key={c} value={c}>{prettyEnum(c)}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="New electorate ID" hint="e.g. ELECTORATE-004">
              <Input value={form.newId} onChange={upd('newId')} placeholder="ELECTORATE-004" />
            </Field>
            <div className="muted" style={{ fontSize: 12 }}>Assigner ID auto-filled from your session.</div>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create electorate'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-head"><h3>All electorates</h3></div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--ink-subtle)' }}>Loading…</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Permissions</th></tr>
            </thead>
            <tbody>
              {electorates.map(el => (
                <tr key={el.electorateId ?? el.id}>
                  <td className="mono" style={{ fontSize: 12 }}>{el.electorateId ?? el.id}</td>
                  <td>{el.firstName ?? ''} {el.lastName ?? el.name ?? ''}</td>
                  <td>
                    <div className="row wrap" style={{ gap: 4 }}>
                      {(el.permissions ?? []).map(p => (
                        <Badge key={p}>{p.replace('CAN_', '').toLowerCase().replace(/_/g, ' ')}</Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {electorates.length === 0 && (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--ink-subtle)', padding: 32 }}>No electorates found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
