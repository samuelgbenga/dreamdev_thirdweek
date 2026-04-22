import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Field from '../../components/ui/Field';
import { Shield } from '../../components/ui/Icons';

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(id.trim());
    } catch {
      setError('Electorate not found.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 440, margin: '48px auto' }}>
      <div className="card card-lg">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--green-soft)', color: 'var(--green-deep)',
            display: 'grid', placeItems: 'center', margin: '0 auto 14px',
          }}>
            <Shield size={20} />
          </div>
          <h2 style={{ marginBottom: 6 }}>Electorate sign in</h2>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>
            Enter your Electorate ID to access the admin console.
          </p>
        </div>
        <form onSubmit={submit} className="stack">
          <Field label="Electorate ID" error={error} hint="e.g. ELECTORATE-001">
            <Input
              value={id}
              onChange={e => { setId(e.target.value); setError(''); }}
              placeholder="ELECTORATE-001"
            />
          </Field>
          <Button variant="primary" type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/" onClick={e => { e.preventDefault(); navigate('/'); }} style={{ fontSize: 13 }}>
            ← Back to public site
          </a>
        </div>
      </div>
    </div>
  );
}
