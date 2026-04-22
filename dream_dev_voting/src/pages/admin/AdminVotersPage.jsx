import { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { voterService } from '../../services/voterService';
import { electorateService } from '../../services/electorateService';
import { initialsOf, prettyEnum } from '../../utils/formatDate';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Check, Search } from '../../components/ui/Icons';

const TABS = [['ALL', 'All'], ['PENDING', 'Pending'], ['APPROVED', 'Approved']];

export default function AdminVotersPage() {
  const { electorateId } = useAdmin();
  const [tab, setTab] = useState('ALL');
  const [query, setQuery] = useState('');
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { load(); }, [tab]);

  async function load() {
    setLoading(true);
    try {
      const res = tab === 'ALL'
        ? await voterService.getAllVoters(electorateId)
        : await electorateService.getVotersByStatus(electorateId, tab);
      setVoters(res.data ?? []);
    } catch {
      setVoters([]);
    } finally {
      setLoading(false);
    }
  }

  async function approve(voterId) {
    try {
      await electorateService.approveVoter(voterId, electorateId);
      setVoters(vs => vs.map(v => (v.voterId ?? v.id) === voterId ? { ...v, status: 'APPROVED' } : v));
      setToast(`Approved ${voterId}`);
      setTimeout(() => setToast(null), 2000);
    } catch {}
  }

  const filtered = useMemo(() => {
    if (!query) return voters;
    const q = query.toLowerCase();
    return voters.filter(v =>
      (v.voterId ?? v.id ?? '').toLowerCase().includes(q) ||
      `${v.firstName} ${v.lastName}`.toLowerCase().includes(q)
    );
  }, [voters, query]);

  const counts = {
    ALL: voters.length,
    PENDING: voters.filter(v => v.status === 'PENDING').length,
    APPROVED: voters.filter(v => v.status === 'APPROVED').length,
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div>
        <div className="eyebrow">Manage</div>
        <h2 style={{ marginTop: 8 }}>Voters</h2>
      </div>

      <div className="card">
        <div className="card-head" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div className="row" style={{ gap: 4, background: 'var(--bg)', padding: 4, borderRadius: 'var(--radius)' }}>
            {TABS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500,
                  background: tab === key ? 'var(--surface)' : 'transparent',
                  color: tab === key ? 'var(--ink)' : 'var(--ink-muted)',
                  boxShadow: tab === key ? 'var(--shadow-sm)' : 'none',
                  border: 'none', cursor: 'pointer',
                }}
              >
                {label} <span style={{ opacity: 0.5, marginLeft: 4 }}>{counts[key]}</span>
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-subtle)' }}>
              <Search size={14} />
            </span>
            <input
              className="input"
              placeholder="Search by ID or name"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ paddingLeft: 34, width: 260 }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--ink-subtle)' }}>Loading…</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Voter ID</th><th>Name</th><th>State</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.voterId ?? v.id}>
                  <td className="mono" style={{ fontSize: 12 }}>{v.voterId ?? v.id}</td>
                  <td>
                    <div className="row" style={{ gap: 10 }}>
                      <div className="candidate-avatar" style={{ width: 28, height: 28, fontSize: 10 }}>
                        {initialsOf(`${v.firstName} ${v.lastName}`)}
                      </div>
                      <span>{v.firstName} {v.lastName}</span>
                    </div>
                  </td>
                  <td>{prettyEnum(v.stateOfResidence ?? v.state ?? '')}</td>
                  <td>
                    {v.status === 'APPROVED'
                      ? <Badge tone="green" dot>Approved</Badge>
                      : <Badge tone="amber" dot>Pending</Badge>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {v.status === 'PENDING' && (
                      <Button variant="primary" size="sm" onClick={() => approve(v.voterId ?? v.id)} icon={<Check />}>
                        Approve
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--ink-subtle)', padding: 32 }}>No voters match.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--ink)', color: 'white', padding: '10px 16px',
          borderRadius: 'var(--radius)', fontSize: 13, boxShadow: 'var(--shadow-lg)', zIndex: 300,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
