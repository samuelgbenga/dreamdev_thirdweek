import { useState } from 'react';
import { electionService } from '../services/electionService';
import { voteService } from '../services/voteService';
import { STATE } from '../constants/enums';
import { prettyEnum, categoryLabel, formatDate, initialsOf } from '../utils/formatDate';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { Calendar, MapPin } from '../components/ui/Icons';

export default function PublicResultsPage() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadElections(state) {
    setLoading(true);
    try {
      const res = state === 'ALL'
        ? await electionService.getAllElections()
        : await electionService.getElectionsByState(state);
      setElections(res.data ?? []);
    } catch {
      setElections([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadResults(election) {
    setSelectedElection(election);
    setLoading(true);
    try {
      const res = await voteService.getCandidatesSummary(election.electionId ?? election.id);
      setSummary(res.data ?? []);
    } catch {
      setSummary([]);
    } finally {
      setLoading(false);
    }
  }

  const sorted = [...summary].sort((a, b) => (b.voteCount ?? b.votes ?? 0) - (a.voteCount ?? a.votes ?? 0));
  const total = sorted.reduce((s, c) => s + (c.voteCount ?? c.votes ?? 0), 0);

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="eyebrow">Live results</div>
          <h2 style={{ marginTop: 8 }}>Current standings</h2>
        </div>
        <div className="row">
          <Select style={{ width: 180 }} onChange={e => loadElections(e.target.value)}>
            <option value="ALL">All states</option>
            {STATE.map(s => <option key={s} value={s}>{prettyEnum(s)}</option>)}
          </Select>
          {elections.length > 0 && (
            <Select style={{ width: 260 }} onChange={e => {
              const el = elections.find(x => (x.electionId ?? x.id) === e.target.value);
              if (el) loadResults(el);
            }}>
              <option value="">Select election</option>
              {elections.map(e => (
                <option key={e.electionId ?? e.id} value={e.electionId ?? e.id}>
                  {e.title ?? e.electionId}
                </option>
              ))}
            </Select>
          )}
        </div>
      </div>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner large /></div>}

      {!loading && selectedElection && (
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div className="card card-lg">
            <div className="card-head" style={{ marginBottom: 20 }}>
              <div>
                <h3>{selectedElection.title ?? selectedElection.electionId}</h3>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                  {categoryLabel(selectedElection.category)} · {prettyEnum(selectedElection.state)}
                </div>
              </div>
              <Badge tone="green" dot>Live</Badge>
            </div>
            <div>
              {sorted.map((c, i) => {
                const votes = c.voteCount ?? c.votes ?? 0;
                const pct = total ? (votes / total) * 100 : 0;
                const name = c.candidateName ?? c.name ?? '';
                return (
                  <div key={c.candidateId ?? c.id ?? i} className="result-row">
                    <div>
                      <div className="result-header">
                        <div className="row" style={{ gap: 10 }}>
                          <div className="candidate-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
                            {initialsOf(name)}
                          </div>
                          <div>
                            <div className="result-name">{name}</div>
                            <div className="muted mono" style={{ fontSize: 11 }}>
                              {[c.party, c.candidateId ?? c.id].filter(Boolean).join(' · ')}
                            </div>
                          </div>
                        </div>
                        <div className="result-votes">{votes.toLocaleString()} votes</div>
                      </div>
                      <div className="result-bar">
                        <div className={`result-bar-fill ${i === 1 ? 'second' : i > 1 ? 'other' : ''}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="result-pct">{pct.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="stack">
            <div className="card">
              <div className="eyebrow" style={{ marginBottom: 8 }}>Total votes</div>
              <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                {total.toLocaleString()}
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Updated just now</div>
            </div>
            {sorted[0] && (
              <div className="card">
                <div className="eyebrow" style={{ marginBottom: 12 }}>Leading</div>
                <div className="row">
                  <div className="candidate-avatar" style={{ background: 'var(--green)', color: 'white', borderColor: 'var(--green)' }}>
                    {initialsOf(sorted[0].candidateName ?? sorted[0].name ?? '')}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{sorted[0].candidateName ?? sorted[0].name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      +{((sorted[0].voteCount ?? sorted[0].votes ?? 0) - (sorted[1]?.voteCount ?? sorted[1]?.votes ?? 0)).toLocaleString()} ahead
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="card">
              <div className="eyebrow" style={{ marginBottom: 10 }}>Window</div>
              {selectedElection.date && (
                <div className="row" style={{ gap: 10 }}>
                  <Calendar size={14} />
                  <span style={{ fontSize: 13 }}>{formatDate(selectedElection.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
              <div className="row" style={{ gap: 10, marginTop: 8 }}>
                <MapPin size={14} />
                <span style={{ fontSize: 13 }}>{prettyEnum(selectedElection.state)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !selectedElection && (
        <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--ink-subtle)' }}>
          Select a state and election to view results.
        </div>
      )}
    </div>
  );
}
