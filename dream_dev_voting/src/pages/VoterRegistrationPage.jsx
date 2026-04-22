import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { voterService } from '../services/voterService';
import { STATE, CITIZENSHIP_TYPE } from '../constants/enums';
import { prettyEnum } from '../utils/formatDate';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Field from '../components/ui/Field';
import Alert from '../components/ui/Alert';
import Stepper from '../components/ui/Stepper';
import { ArrowRight, ArrowLeft, Copy, Check } from '../components/ui/Icons';

const empty = { firstName: '', lastName: '', dob: '', state: '', citizenshipType: 'REGISTRATION' };

export default function VoterRegistrationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [copied, setCopied] = useState(false);

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.firstName) errs.firstName = 'Required';
    if (!form.lastName) errs.lastName = 'Required';
    if (!form.dob) errs.dob = 'Required';
    if (!form.state) errs.state = 'Choose a state';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await voterService.registerVoter({
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dob,
        stateOfResidence: form.state,
        citizenship: form.citizenshipType,
      });
      const voterId = res.data?.voterId ?? `NIG-${form.state.slice(0, 2)}-${Date.now().toString().slice(-8)}`;
      setSubmitted({ voterId });
    } catch (err) {
      setErrors({ api: err?.message ?? 'Registration failed' });
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard?.writeText(submitted.voterId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 540, margin: '24px auto' }}>
        <Stepper steps={['Register', 'Approval', 'Vote']} current={1} />
        <div className="card card-lg">
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 999,
              background: 'var(--green-soft)', color: 'var(--green-deep)',
              display: 'grid', placeItems: 'center', margin: '0 auto 16px',
            }}>
              <Check size={24} />
            </div>
            <h2 style={{ marginBottom: 8 }}>Registration received</h2>
            <p className="muted" style={{ margin: 0 }}>Save your Voter ID. You'll need it to vote.</p>
          </div>
          <div className="token-display" style={{ marginBottom: 16 }}>
            <span className="label">Voter ID</span>
            <span style={{ flex: 1 }}>{submitted.voterId}</span>
            <Button variant="ghost" size="sm" onClick={copy} icon={<Copy />}>{copied ? 'Copied' : 'Copy'}</Button>
          </div>
          <Alert tone="amber">
            <strong>Pending approval.</strong> An electorate officer will review your submission. Typically under 24 hours.
          </Alert>
          <div className="row" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => navigate('/')}>Back home</Button>
            <Button variant="primary" onClick={() => navigate('/vote')} trailingIcon={<ArrowRight />}>
              Continue to voting
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 540, margin: '24px auto' }}>
      <Stepper steps={['Register', 'Approval', 'Vote']} current={0} />
      <div className="card card-lg">
        <h2 style={{ marginBottom: 6 }}>Register to vote</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 24 }}>
          We'll generate a unique Voter ID once you submit.
        </p>
        {errors.api && <Alert tone="danger" style={{ marginBottom: 16 }}>{errors.api}</Alert>}
        <form className="stack" onSubmit={submit}>
          <div className="grid grid-2">
            <Field label="First name" error={errors.firstName}>
              <Input value={form.firstName} onChange={update('firstName')} placeholder="Adaeze" />
            </Field>
            <Field label="Last name" error={errors.lastName}>
              <Input value={form.lastName} onChange={update('lastName')} placeholder="Okonkwo" />
            </Field>
          </div>
          <Field label="Date of birth" error={errors.dob}>
            <Input type="date" value={form.dob} onChange={update('dob')} />
          </Field>
          <Field label="State of residence" error={errors.state}>
            <Select value={form.state} onChange={update('state')}>
              <option value="">Choose a state</option>
              {STATE.map(s => <option key={s} value={s}>{prettyEnum(s)}</option>)}
            </Select>
          </Field>
          <Field label="Citizenship type">
            <Select value={form.citizenshipType} onChange={update('citizenshipType')}>
              {CITIZENSHIP_TYPE.map(c => <option key={c} value={c}>{prettyEnum(c)}</option>)}
            </Select>
          </Field>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
            <Button variant="ghost" onClick={() => navigate('/')} icon={<ArrowLeft />}>Back</Button>
            <Button variant="primary" type="submit" disabled={loading} trailingIcon={<ArrowRight />}>
              {loading ? 'Submitting…' : 'Submit registration'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
