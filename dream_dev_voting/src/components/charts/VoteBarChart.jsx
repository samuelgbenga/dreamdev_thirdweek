import { initialsOf } from '../../utils/formatDate';

export default function VoteBarChart({ data = [] }) {
  const sorted = [...data].sort((a, b) => (b.voteCount ?? b.votes ?? 0) - (a.voteCount ?? a.votes ?? 0));
  const max = sorted[0]?.voteCount ?? sorted[0]?.votes ?? 1;

  return (
    <div>
      {sorted.map((c, i) => {
        const votes = c.voteCount ?? c.votes ?? 0;
        const pct = max ? (votes / max) * 100 : 0;
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
                    {(c.party || c.candidateId) && (
                      <div className="muted mono" style={{ fontSize: 11 }}>
                        {[c.party, c.candidateId ?? c.id].filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="result-votes">{votes.toLocaleString()} votes</div>
              </div>
              <div className="result-bar">
                <div
                  className={`result-bar-fill ${i === 1 ? 'second' : i > 1 ? 'other' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <div className="result-pct">
              {max ? ((votes / (sorted.reduce((s, x) => s + (x.voteCount ?? x.votes ?? 0), 0))) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
