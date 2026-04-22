import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { voterService } from '../../services/voterService';
import { electionService } from '../../services/electionService';
import { candidateService } from '../../services/candidateService';
import { voteService } from '../../services/voteService';
import { electorateService } from '../../services/electorateService';
import { initialsOf, prettyEnum } from '../../utils/formatDate';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ArrowRight } from '../../components/ui/Icons';

export default function AdminDashboardPage() {
  const { electorateId } = useAdmin();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ voters: 0, elections: 0, candidates: 0, votes: 0, pending: 0, defaulted: 0 });
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      voterService.getAllVoters(electorateId),
      electionService.getAllElections(),
      candidateService.getAllCandidates(),
      voteService.getAllVotes(electorateId),
      electorateService.getVotersByStatus(electorateId, 'PENDING'),
    ]).then(([v, e, c, vt, p]) => {
      if (c.status === "fulfilled") {
        console.log("Candidates response:", c.value);
        console.log("Candidates data:", c.value?.data);
      } else {
        console.error("Candidates error:", c.reason);
      }

      const voters = v.value?.data ?? [];
      const votes = vt.value?.data?.content ?? vt.value?.data ?? [];
      const pendingList = p.value?.data ?? [];
      setCounts({
        voters: voters.length,
        elections: (e.value?.data ?? []).length,
        candidates: (c.value?.data ?? []).length,
        votes: votes.filter(x => x.status === 'VOTED').length,
        pending: pendingList.length,
        defaulted: votes.filter(x => x.status === 'DEFAULTED').length,
      });
      setPending(pendingList.slice(0, 4));
    }).finally(() => setLoading(false));
  }, [electorateId]);

  const stats = [
    { label: 'Total voters', value: counts.voters, sub: `${counts.pending} pending`, to: '/admin/voters' },
    { label: 'Elections', value: counts.elections, sub: 'Upcoming & active', to: '/admin/elections' },
    { label: 'Candidates', value: counts.candidates, sub: 'Across all elections', to: '/admin/candidates' },
    { label: 'Votes cast', value: counts.votes, sub: `${counts.defaulted} defaulted`, to: '/admin/votes' },
  ];

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div>
        <div className="eyebrow">Overview</div>
        <h2 style={{ marginTop: 8 }}>Dashboard</h2>
      </div>

      <div className="grid grid-4">
        {stats.map(s => (
          <button key={s.label} onClick={() => navigate(s.to)} className="card" style={{ textAlign: 'left', cursor: 'pointer' }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '–' : s.value}
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{s.sub}</div>
          </button>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-head">
            <h3>Pending approvals</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/voters')} trailingIcon={<ArrowRight />}>
              View all
            </Button>
          </div>
          {pending.length === 0 && !loading && <div className="muted">Nothing to review.</div>}
          {pending.map(v => (
            <div key={v.voterId ?? v.id} className="row-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="row" style={{ gap: 10 }}>
                <div className="candidate-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
                  {initialsOf(`${v.firstName} ${v.lastName}`)}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{v.firstName} {v.lastName}</div>
                  <div className="muted mono" style={{ fontSize: 11 }}>{v.voterId} · {prettyEnum(v.stateOfResidence ?? v.state)}</div>
                </div>
              </div>
              <Badge tone="amber" dot>Pending</Badge>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-head"><h3>Quick actions</h3></div>
          <div className="stack" style={{ gap: 8 }}>
            <Button variant="secondary" fullWidth onClick={() => navigate('/admin/elections')}>Upload elections CSV</Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('/admin/candidates')}>Upload candidates CSV</Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('/admin/electorates')}>Create electorate</Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('/admin/permissions')}>Assign permission</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
