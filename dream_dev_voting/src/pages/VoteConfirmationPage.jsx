import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { voterService } from '../services/voterService';
import Button from '../components/ui/Button';
import { ArrowRight, Check, Warn } from '../components/ui/Icons';

export default function VoteConfirmationPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [state, setState] = useState('confirming');
  const [voteId, setVoteId] = useState(null);

  useEffect(() => {
    if (!token) { setState('expired'); return; }
    voterService.confirmVote(token)
      .then(res => { setVoteId(res.data?.voteId); setState('success'); })
      .catch(() => setState('expired'));
  }, [token]);

  return (
    <div style={{ maxWidth: 520, margin: '40px auto' }}>
      <div className="card card-lg" style={{ textAlign: 'center' }}>
        {state === 'confirming' && (
          <>
            <div className="spinner spinner-lg" style={{ margin: '8px auto 20px' }} />
            <h2 style={{ marginBottom: 8 }}>Confirming your vote…</h2>
            <p className="muted" style={{ margin: 0 }}>Validating token signature.</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: 999,
              background: 'var(--green-soft)', color: 'var(--green-deep)',
              display: 'grid', placeItems: 'center', margin: '0 auto 20px',
            }}>
              <Check size={28} />
            </div>
            <h2 style={{ marginBottom: 8 }}>Your vote counts</h2>
            <p className="muted" style={{ margin: '0 0 20px' }}>
              Thank you for participating. Your vote has been recorded anonymously.
            </p>
            {voteId && (
              <div className="token-display" style={{ textAlign: 'left', marginBottom: 20 }}>
                <span className="label">Vote ID</span>
                <span style={{ flex: 1 }}>{voteId}</span>
              </div>
            )}
            <div className="row" style={{ justifyContent: 'center' }}>
              <Button variant="secondary" onClick={() => navigate('/')}>Home</Button>
              <Button variant="primary" onClick={() => navigate('/results')} trailingIcon={<ArrowRight />}>
                See live results
              </Button>
            </div>
          </>
        )}

        {state === 'expired' && (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: 999,
              background: 'var(--danger-soft)', color: 'var(--danger)',
              display: 'grid', placeItems: 'center', margin: '0 auto 20px',
            }}>
              <Warn size={24} />
            </div>
            <h2 style={{ marginBottom: 8 }}>Token expired</h2>
            <p className="muted" style={{ margin: '0 0 20px' }}>
              This confirmation link is no longer valid. Start a new vote to continue.
            </p>
            <Button variant="primary" onClick={() => navigate('/vote')}>Restart voting</Button>
          </>
        )}
      </div>
    </div>
  );
}
