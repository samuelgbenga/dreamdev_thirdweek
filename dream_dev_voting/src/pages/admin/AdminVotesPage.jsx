import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useVotes } from '../../hooks/useVotes';
import { voteService } from '../../services/voteService';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Input from '../../components/ui/Input';

const PAGE_SIZE = 10;

export default function AdminVotesPage() {
  const { electorateId } = useAdmin();
  const [page, setPage] = useState(0);
  const { votes, loading } = useVotes(electorateId, page, PAGE_SIZE);
  const [electionId, setElectionId] = useState('');
  const [summary, setSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const rows = votes?.content ?? (Array.isArray(votes) ? votes : []);
  const totalPages = votes?.totalPages ?? 1;

  async function loadSummary() {
    if (!electionId) return;
    setSummaryLoading(true);
    try {
      const res = await voteService.getCandidatesSummary(electionId);
      setSummary(res.data ?? []);
    } catch {
      setSummary([]);
    } finally {
      setSummaryLoading(false);
    }
  }

  const summaryMax = summary.reduce((m, c) => Math.max(m, c.voteCount ?? c.votes ?? 0), 1);

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div>
        <div className="eyebrow">Audit</div>
        <h2 style={{ marginTop: 8 }}>Votes log</h2>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-head">
            <h3>All votes</h3>
            <div className="muted" style={{ fontSize: 13 }}>{rows.length} records</div>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--ink-subtle)' }}>Loading…</div>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr><th>Election</th><th>Candidate</th><th>Status</th><th>Created</th></tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className="mono" style={{ fontSize: 12 }}>{r.electionId}</td>
                      <td className="mono" style={{ fontSize: 12 }}>{r.candidateId}</td>
                      <td>
                        {r.status === 'VOTED'
                          ? <Badge tone="green" dot>Voted</Badge>
                          : <Badge tone="red" dot>Defaulted</Badge>}
                      </td>
                      <td className="mono" style={{ fontSize: 12 }}>{r.createdAt}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--ink-subtle)', padding: 32 }}>No votes found.</td></tr>
                  )}
                </tbody>
              </table>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>

        <div className="card">
          <div className="card-head"><h3>Election summary</h3></div>
          <div className="row" style={{ marginBottom: 16, gap: 8 }}>
            <Input
              placeholder="Election ID"
              value={electionId}
              onChange={e => setElectionId(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button variant="secondary" size="sm" onClick={loadSummary} disabled={!electionId || summaryLoading}>Load</Button>
          </div>
          {summaryLoading && <div className="muted" style={{ textAlign: 'center' }}>Loading…</div>}
          {summary.map((c, i) => {
            const votes = c.voteCount ?? c.votes ?? 0;
            const pct = (votes / summaryMax) * 100;
            return (
              <div key={c.candidateId ?? i} style={{ marginBottom: 10 }}>
                <div className="row-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{c.candidateName ?? c.name}</span>
                  <span className="mono" style={{ fontSize: 12 }}>{votes.toLocaleString()}</span>
                </div>
                <div className="result-bar">
                  <div className={`result-bar-fill ${i > 0 ? 'other' : ''}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
