import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { voterService } from '../services/voterService';
import { electionService } from '../services/electionService';
import { candidateService } from '../services/candidateService';
import { STATE } from '../constants/enums';
import { formatDateParts, prettyEnum, categoryLabel, initialsOf } from '../utils/formatDate';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Field from '../components/ui/Field';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';
import Stepper from '../components/ui/Stepper';
import { ArrowRight, ArrowLeft, Shield, MapPin } from '../components/ui/Icons';

function ElectionCard({ election, onClick, selected }) {
  const parts = formatDateParts(election.date ?? election.electionDate ?? '2026-01-01');
  return (
    <div
      className={`election-card selectable ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="election-date">
        <div className="day">{parts.day}</div>
        <div className="month">{parts.month}</div>
      </div>
      <div className="election-meta">
        <div className="election-title">{election.title ?? election.electionId}</div>
        <div className="election-sub">
          <Badge tone="green">{categoryLabel(election.category)}</Badge>
          <span className="election-sub-sep">·</span>
          <span><MapPin size={11} /> {prettyEnum(election.state)}</span>
        </div>
      </div>
      <span className="mono subtle" style={{ fontSize: 11 }}>{election.electionId ?? election.id}</span>
    </div>
  );
}

export default function VotingPortalPage() {
  const navigate = useNavigate();
  const [voterId, setVoterId] = useState(() => { try { return localStorage.getItem('ddv_voterId') || ''; } catch { return ''; } });
  const [authed, setAuthed] = useState(!!localStorage.getItem('ddv_voterId'));
  const [stateFilter, setStateFilter] = useState('ALL');
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [initiated, setInitiated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadElections(state) {
    setLoading(true);
    setError(null);
    try {
      const res = state === 'ALL'
        ? await electionService.getAllElections()
        : await electionService.getElectionsByState(state);
      setElections(res.data ?? []);
    } catch (err) {
      setError(err?.message ?? 'Failed to load elections');
    } finally {
      setLoading(false);
    }
  }

  async function selectElection(e) {
    setSelectedElection(e);
    setSelectedCandidate(null);
    setLoading(true);
    try {
      const res = await candidateService.getCandidatesByElectionId(e.electionId ?? e.id);
      setCandidates(res.data ?? []);
    } catch {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }

  async function submitVote() {
    setLoading(true);
    setError(null);
    try {
      const res = await voterService.initiateVote({
        voterId,
        electionId: selectedElection.electionId ?? selectedElection.id,
        candidateId: selectedCandidate.candidateId ?? selectedCandidate.id,
      });
      setInitiated({ token: res.data?.token ?? res.data?.confirmationLink });
      setConfirmOpen(false);
    } catch (err) {
      setError(err?.message ?? 'Vote submission failed');
      setConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <div style={{ maxWidth: 460, margin: '24px auto' }}>
        <Stepper steps={['Identify', 'Choose', 'Confirm']} current={0} />
        <div className="card card-lg">
          <h2 style={{ marginBottom: 6 }}>Verify your Voter ID</h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: 20 }}>
            Enter the ID you received at registration.
          </p>
          <Field label="Voter ID" hint="Format: NIG-XX-########">
            <Input value={voterId} onChange={e => setVoterId(e.target.value)} placeholder="NIG-LA-12345678" />
          </Field>
          <div className="row" style={{ marginTop: 20, justifyContent: 'space-between' }}>
            <Button variant="ghost" onClick={() => navigate('/')} icon={<ArrowLeft />}>Back</Button>
            <Button variant="primary" disabled={!voterId} onClick={() => setAuthed(true)} trailingIcon={<ArrowRight />}>
              Continue
            </Button>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/register">Don't have a Voter ID? Register →</a>
        </div>
      </div>
    );
  }

  if (initiated) {
    return (
      <div style={{ maxWidth: 560, margin: '24px auto' }}>
        <Stepper steps={['Identify', 'Choose', 'Confirm']} current={2} />
        <div className="card card-lg">
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 999,
              background: 'var(--green-soft)', color: 'var(--green-deep)',
              display: 'grid', placeItems: 'center', margin: '0 auto 16px',
            }}>
              <Shield size={22} />
            </div>
            <h2 style={{ marginBottom: 8 }}>Check your email</h2>
            <p className="muted" style={{ margin: 0 }}>
              We've sent a confirmation link to your registered email address.
            </p>
          </div>
          <Alert tone="amber">
            <strong>You have 10 minutes to confirm your vote.</strong> If you don't confirm within this window, your vote will be invalid.
          </Alert>
          {initiated.token && (
            <div className="token-display" style={{ marginTop: 16 }}>
              <span className="label">Link</span>
              <span style={{ flex: 1, wordBreak: 'break-all' }}>{initiated.token}</span>
            </div>
          )}
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={() => navigate('/vote/confirm?token=' + encodeURIComponent(initiated.token ?? ''))} trailingIcon={<ArrowRight />}>
              Confirm my vote
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Stepper steps={['Identify', 'Choose', 'Confirm']} current={1} />
      <div className="row-between" style={{ marginBottom: 16 }}>
        <div>
          <div className="eyebrow">Voting portal</div>
          <h2 style={{ marginTop: 8 }}>Select an election</h2>
        </div>
        <div className="user-badge">
          <span className="user-badge-dot">{voterId.slice(4, 6)}</span>
          <span className="mono">{voterId}</span>
        </div>
      </div>

      {error && <Alert tone="danger" style={{ marginBottom: 16 }}>{error}</Alert>}

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="card-head" style={{ marginBottom: 12 }}>
            <h3>Elections</h3>
            <Select value={stateFilter} onChange={e => { setStateFilter(e.target.value); loadElections(e.target.value); }} style={{ width: 160 }}>
              <option value="ALL">All states</option>
              {STATE.map(s => <option key={s} value={s}>{prettyEnum(s)}</option>)}
            </Select>
          </div>
          <div className="elections-list">
            {loading && !selectedElection && <div className="card" style={{ textAlign: 'center', color: 'var(--ink-subtle)' }}>Loading…</div>}
            {elections.length === 0 && !loading && (
              <div className="card" style={{ textAlign: 'center', color: 'var(--ink-subtle)' }}>Select a state to load elections.</div>
            )}
            {elections.map(e => (
              <ElectionCard
                key={e.electionId ?? e.id}
                election={e}
                onClick={() => selectElection(e)}
                selected={selectedElection?.electionId === e.electionId}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="card-head" style={{ marginBottom: 12 }}>
            <h3>Candidates</h3>
            {selectedElection && <span className="mono subtle" style={{ fontSize: 12 }}>{selectedElection.electionId}</span>}
          </div>
          {!selectedElection ? (
            <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--ink-subtle)' }}>
              Select an election to view candidates.
            </div>
          ) : (
            <div className="stack" style={{ gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {candidates.map(c => (
                  <button
                    key={c.candidateId ?? c.id}
                    className={`candidate-card ${selectedCandidate?.candidateId === (c.candidateId ?? c.id) ? 'selected' : ''}`}
                    onClick={() => setSelectedCandidate(c)}
                  >
                    <div className="candidate-avatar">{initialsOf(c.candidateName ?? c.name ?? '')}</div>
                    <div className="candidate-info">
                      <div className="candidate-name">{c.candidateName ?? c.name}</div>
                      <div className="candidate-id">{[c.party, c.candidateId ?? c.id].filter(Boolean).join(' · ')}</div>
                    </div>
                    <div className="candidate-radio" />
                  </button>
                ))}
              </div>
              <Button
                variant="primary"
                size="lg"
                disabled={!selectedCandidate}
                onClick={() => setConfirmOpen(true)}
                fullWidth
              >
                Review vote
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm your choice"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={submitVote} disabled={loading}>
              {loading ? 'Submitting…' : 'Submit vote'}
            </Button>
          </>
        }
      >
        {selectedCandidate && selectedElection && (
          <div className="stack">
            <div className="muted" style={{ fontSize: 13 }}>You're voting in</div>
            <div>
              <div style={{ fontWeight: 600 }}>{selectedElection.title ?? selectedElection.electionId}</div>
              <div className="muted" style={{ fontSize: 13 }}>{categoryLabel(selectedElection.category)} · {prettyEnum(selectedElection.state)}</div>
            </div>
            <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
            <div className="muted" style={{ fontSize: 13 }}>For</div>
            <div className="row">
              <div className="candidate-avatar" style={{ background: 'var(--green)', color: 'white', borderColor: 'var(--green)' }}>
                {initialsOf(selectedCandidate.candidateName ?? selectedCandidate.name ?? '')}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{selectedCandidate.candidateName ?? selectedCandidate.name}</div>
                <div className="muted mono" style={{ fontSize: 12 }}>{selectedCandidate.candidateId ?? selectedCandidate.id}</div>
              </div>
            </div>
            <Alert tone="amber">You can't change your vote once submitted. One vote per election.</Alert>
          </div>
        )}
      </Modal>
    </div>
  );
}
