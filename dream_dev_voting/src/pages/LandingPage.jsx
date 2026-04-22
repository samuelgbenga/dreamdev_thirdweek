import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { electionService } from '../services/electionService';
import { STATE } from '../constants/enums';
import { formatDateParts, prettyEnum, categoryLabel, initialsOf } from '../utils/formatDate';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Countdown from '../components/ui/Countdown';
import { ArrowRight, MapPin, Shield } from '../components/ui/Icons';

const NEXT_ELECTION_DATE = '2026-05-18T08:00:00';

function ElectionCard({ election, onClick, selected }) {
  const parts = formatDateParts(election.date ?? election.electionDate ?? '2026-01-01');
  return (
    <div
      className={`election-card ${onClick ? 'selectable' : ''} ${selected ? 'selected' : ''}`}
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
          <span className="election-sub-sep">·</span>
          <span>{election.startsAt ?? election.startTime}–{election.stopTime}</span>
        </div>
      </div>
      <span className="mono subtle" style={{ fontSize: 11 }}>{election.id ?? election.electionId}</span>
    </div>
  );
}

const HERO_CANDIDATES = [
  { id: 'CAND-P01', name: 'Adaeze Okonkwo', party: 'PDP' },
  { id: 'CAND-P02', name: 'Ibrahim Musa', party: 'APC' },
  { id: 'CAND-P03', name: 'Chinedu Eze', party: 'LP' },
];

function HeroVisual() {
  return (
    <div className="hero-visual">
      <div className="row-between" style={{ marginBottom: 16 }}>
        <Badge tone="green" dot>Ballot preview</Badge>
        <span className="mono subtle" style={{ fontSize: 11 }}>ELEC-001</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 4 }}>Presidential · National</div>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>2026 Presidential Election</div>
      <div className="stack" style={{ gap: 8 }}>
        {HERO_CANDIDATES.map((c, i) => (
          <div key={c.id} className={`candidate-card ${i === 1 ? 'selected' : ''}`} style={{ cursor: 'default' }}>
            <div className="candidate-avatar">{initialsOf(c.name)}</div>
            <div className="candidate-info">
              <div className="candidate-name" style={{ fontSize: 13 }}>{c.name}</div>
              <div className="candidate-id">{c.party}</div>
            </div>
            <div className="candidate-radio" />
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div className="row" style={{ marginTop: 16, fontSize: 12, color: 'var(--ink-subtle)' }}>
        <Shield size={12} />
        <span>One vote per voter · JWT confirmed</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [stateFilter, setStateFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchElections() {
    setLoading(true);
    try {
      const res = stateFilter !== 'ALL'
        ? await electionService.getElectionsByStateAndDate(stateFilter, dateFilter)
        : await electionService.getAllElections();
      setElections(res.data ?? []);
      console.log(res.data);
    } catch {
      setElections([]);
    } finally {
      setLoading(false);
      console.log("fetchElections");
    }
  }

  return (
    <div className="stack" style={{ gap: 56 }}>
      {/* HERO */}
      <section className="hero">
        <div>
          <div className="countdown">
            <span className="dot" />
            Next election in <Countdown target={NEXT_ELECTION_DATE} />
          </div>
          <h1>A simpler way to cast your vote.</h1>
          <p className="lead">
            Dream Dev Vote is a transparent, auditable voting platform. Register once, verify by email, and cast your ballot from anywhere in Nigeria.
          </p>
          <div className="row wrap">
            <Button variant="primary" size="lg" onClick={() => navigate('/register')} trailingIcon={<ArrowRight />}>
              Register to vote
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/results')}>
              View live results
            </Button>
          </div>
        </div>
        <HeroVisual />
      </section>

      {/* HOW IT WORKS */}
      <section>
        <div className="row-between" style={{ marginBottom: 16 }}>
          <div>
            <div className="eyebrow">How it works</div>
            <h2 style={{ marginTop: 8 }}>Four steps from registration to results</h2>
          </div>
        </div>
        <div className="steps">
          {[
            { t: 'Register', d: 'Submit your details and receive a Voter ID.' },
            { t: 'Approve', d: 'An electorate verifies and approves your record.' },
            { t: 'Vote', d: 'Pick a candidate in a time-boxed voting window.' },
            { t: 'Confirm', d: 'Use the one-time link we email to lock in your vote.' },
          ].map((s, i) => (
            <div key={i} className="step">
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ELECTIONS */}
      <section>
        <div className="row-between" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow">Upcoming elections</div>
            <h2 style={{ marginTop: 8 }}>Scheduled ballots</h2>
          </div>
          <div className="row">
            <Select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={{ width: 180 }}>
              <option value="ALL">All states</option>
              {STATE.map(s => <option key={s} value={s}>{prettyEnum(s)}</option>)}
            </Select>
            <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: 160 }} />
            <Button variant="secondary" size="sm" onClick={fetchElections}>Search</Button>
          </div>
        </div>
        <div className="elections-list">
          {loading && <div className="card" style={{ textAlign: 'center', color: 'var(--ink-subtle)' }}>Loading…</div>}
          {!loading && elections.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--ink-subtle)' }}>
              Search above to see elections.
            </div>
          )}
          {elections.map(e => <ElectionCard key={e.electionId ?? e.id} election={e} />)}
        </div>
      </section>
    </div>
  );
}
