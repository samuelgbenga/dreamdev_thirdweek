// Page components for Dream Dev Vote

const uS = React.useState;
const uE = React.useEffect;
const uM = React.useMemo;

// ==================== LANDING PAGE ====================
function LandingPage({ navigate }) {
  const [stateFilter, setStateFilter] = uS('ALL');
  const [dateFilter, setDateFilter] = uS('');

  const elections = uM(() => {
    return window.MOCK_ELECTIONS.filter(e => {
      if (stateFilter !== 'ALL' && e.state !== stateFilter) return false;
      if (dateFilter && e.date !== dateFilter) return false;
      return true;
    });
  }, [stateFilter, dateFilter]);

  return (
    <div className="stack" style={{ gap: 56 }}>
      {/* HERO */}
      <section className="hero">
        <div>
          <div className="countdown">
            <span className="dot" />
            Next election in <Countdown target={window.NEXT_ELECTION_DATE} />
          </div>
          <h1>A simpler way to cast your vote.</h1>
          <p className="lead">
            Dream Dev Vote is a transparent, auditable voting platform. Register once, verify by email, and cast your ballot from anywhere in Nigeria.
          </p>
          <div className="row wrap">
            <Button variant="primary" size="lg" onClick={() => navigate('register')} trailingIcon={<Icon.ArrowRight />}>
              Register to vote
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('results')}>
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
              {window.STATES.map(s => <option key={s} value={s}>{prettyEnum(s)}</option>)}
            </Select>
            <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: 160 }} />
          </div>
        </div>
        <div className="elections-list">
          {elections.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--ink-subtle)' }}>
              No elections match these filters.
            </div>
          )}
          {elections.map(e => <ElectionCard key={e.id} election={e} />)}
        </div>
      </section>
    </div>
  );
}

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
        {window.MOCK_CANDIDATES['ELEC-001'].slice(0, 3).map((c, i) => (
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
        <Icon.Shield size={12} />
        <span>One vote per voter · JWT confirmed</span>
      </div>
    </div>
  );
}

function ElectionCard({ election, onClick, selected }) {
  const parts = formatDateParts(election.date);
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
        <div className="election-title">{election.title}</div>
        <div className="election-sub">
          <Badge tone="green">{categoryLabel(election.category)}</Badge>
          <span className="election-sub-sep">·</span>
          <span><Icon.MapPin size={11} /> {prettyEnum(election.state)}</span>
          <span className="election-sub-sep">·</span>
          <span>{election.startsAt}–{election.endsAt}</span>
        </div>
      </div>
      <span className="mono subtle" style={{ fontSize: 11 }}>{election.id}</span>
    </div>
  );
}

// ==================== REGISTER ====================
function RegisterPage({ navigate }) {
  const [form, setForm] = uS({
    firstName: '', lastName: '', dob: '',
    state: '', citizenship: 'REGISTRATION'
  });
  const [errors, setErrors] = uS({});
  const [submitted, setSubmitted] = uS(null);
  const [copied, setCopied] = uS(false);

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.firstName) errs.firstName = 'Required';
    if (!form.lastName) errs.lastName = 'Required';
    if (!form.dob) errs.dob = 'Required';
    if (!form.state) errs.state = 'Choose a state';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const voterId = `NIG-${form.state.slice(0, 2)}-${Date.now().toString().slice(-8)}`;
    setSubmitted({ voterId });
    try { localStorage.setItem('ddv_voterId', voterId); } catch {}
  };

  const copy = () => {
    navigator.clipboard?.writeText(submitted.voterId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 540, margin: '24px auto' }}>
        <Stepper steps={['Register', 'Approval', 'Vote']} current={1} />
        <div className="card card-lg">
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 999,
              background: 'var(--green-soft)', color: 'var(--green-deep)',
              display: 'grid', placeItems: 'center', margin: '0 auto 16px'
            }}>
              <Icon.Check size={24} />
            </div>
            <h2 style={{ marginBottom: 8 }}>Registration received</h2>
            <p className="muted" style={{ margin: 0 }}>
              Save your Voter ID. You'll need it to vote.
            </p>
          </div>
          <div className="token-display" style={{ marginBottom: 16 }}>
            <span className="label">Voter ID</span>
            <span style={{ flex: 1 }}>{submitted.voterId}</span>
            <Button variant="ghost" size="sm" onClick={copy} icon={<Icon.Copy />}>{copied ? 'Copied' : 'Copy'}</Button>
          </div>
          <Alert tone="amber">
            <strong>Pending approval.</strong> An electorate officer will review your submission. Typically under 24 hours.
          </Alert>
          <div className="row" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => navigate('landing')}>Back home</Button>
            <Button variant="primary" onClick={() => navigate('vote')} trailingIcon={<Icon.ArrowRight />}>
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
        <form className="stack" onSubmit={submit}>
          <div className="grid grid-2">
            <Field label="First name" error={errors.firstName}>
              <Input value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Adaeze" />
            </Field>
            <Field label="Last name" error={errors.lastName}>
              <Input value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Okonkwo" />
            </Field>
          </div>
          <Field label="Date of birth" error={errors.dob}>
            <Input type="date" value={form.dob} onChange={e => update('dob', e.target.value)} />
          </Field>
          <Field label="State of residence" error={errors.state}>
            <Select value={form.state} onChange={e => update('state', e.target.value)}>
              <option value="">Choose a state</option>
              {window.STATES.map(s => <option key={s} value={s}>{prettyEnum(s)}</option>)}
            </Select>
          </Field>
          <Field label="Citizenship type">
            <Select value={form.citizenship} onChange={e => update('citizenship', e.target.value)}>
              {window.CITIZENSHIP_TYPES.map(c => <option key={c} value={c}>{prettyEnum(c)}</option>)}
            </Select>
          </Field>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
            <Button variant="ghost" onClick={() => navigate('landing')} icon={<Icon.ArrowLeft />}>Back</Button>
            <Button variant="primary" type="submit" trailingIcon={<Icon.ArrowRight />}>Submit registration</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== VOTING PORTAL ====================
function VotePage({ navigate, setVoteToken }) {
  const savedId = (() => { try { return localStorage.getItem('ddv_voterId') || ''; } catch { return ''; } })();
  const [voterId, setVoterId] = uS(savedId);
  const [authed, setAuthed] = uS(!!savedId);
  const [stateFilter, setStateFilter] = uS('ALL');
  const [selectedElection, setSelectedElection] = uS(null);
  const [selectedCandidate, setSelectedCandidate] = uS(null);
  const [confirmOpen, setConfirmOpen] = uS(false);
  const [initiated, setInitiated] = uS(null);

  const elections = uM(() => {
    return window.MOCK_ELECTIONS.filter(e => stateFilter === 'ALL' || e.state === stateFilter);
  }, [stateFilter]);

  const candidates = selectedElection ? window.MOCK_CANDIDATES[selectedElection.id] || [] : [];

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
            <Button variant="ghost" onClick={() => navigate('landing')} icon={<Icon.ArrowLeft />}>Back</Button>
            <Button variant="primary" disabled={!voterId} onClick={() => setAuthed(true)} trailingIcon={<Icon.ArrowRight />}>
              Continue
            </Button>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="#" onClick={e => { e.preventDefault(); navigate('register'); }}>Don't have a Voter ID? Register →</a>
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
              display: 'grid', placeItems: 'center', margin: '0 auto 16px'
            }}>
              <Icon.Shield size={22} />
            </div>
            <h2 style={{ marginBottom: 8 }}>Check your email</h2>
            <p className="muted" style={{ margin: 0 }}>
              We've sent a confirmation link to your registered email address.
            </p>
          </div>
          <Alert tone="amber">
            <strong>You have 10 minutes to confirm your vote.</strong> If you don't confirm within this window, your vote will be invalid and you'll need to start again.
          </Alert>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={() => { setVoteToken(initiated.token); navigate('confirm'); }} trailingIcon={<Icon.ArrowRight />}>
              I've clicked the link
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

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="card-head" style={{ marginBottom: 12 }}>
            <h3>Elections</h3>
            <Select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={{ width: 160 }}>
              <option value="ALL">All states</option>
              {window.STATES.map(s => <option key={s} value={s}>{prettyEnum(s)}</option>)}
            </Select>
          </div>
          <div className="elections-list">
            {elections.map(e => (
              <ElectionCard
                key={e.id}
                election={e}
                onClick={() => { setSelectedElection(e); setSelectedCandidate(null); }}
                selected={selectedElection?.id === e.id}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="card-head" style={{ marginBottom: 12 }}>
            <h3>Candidates</h3>
            {selectedElection && <span className="mono subtle" style={{ fontSize: 12 }}>{selectedElection.id}</span>}
          </div>
          {!selectedElection ? (
            <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--ink-subtle)' }}>
              Select an election to view candidates.
            </div>
          ) : (
            <div className="stack" style={{ gap: 10 }}>
              <div className="candidates-grid" style={{ gridTemplateColumns: '1fr' }}>
                {candidates.map(c => (
                  <button
                    key={c.id}
                    className={`candidate-card ${selectedCandidate?.id === c.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCandidate(c)}
                  >
                    <div className="candidate-avatar">{initialsOf(c.name)}</div>
                    <div className="candidate-info">
                      <div className="candidate-name">{c.name}</div>
                      <div className="candidate-id">{c.party} · {c.id}</div>
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
            <Button variant="primary" onClick={() => {
              const token = 'eyJhbGciOiJIUzI1NiJ9.' + btoa(JSON.stringify({ v: voterId, c: selectedCandidate.id, e: selectedElection.id, t: Date.now() })) + '.sig';
              setInitiated({ token });
              setConfirmOpen(false);
            }}>Submit vote</Button>
          </>
        }
      >
        {selectedCandidate && selectedElection && (
          <div className="stack">
            <div className="muted" style={{ fontSize: 13 }}>You're voting in</div>
            <div>
              <div style={{ fontWeight: 600 }}>{selectedElection.title}</div>
              <div className="muted" style={{ fontSize: 13 }}>{categoryLabel(selectedElection.category)} · {prettyEnum(selectedElection.state)}</div>
            </div>
            <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
            <div className="muted" style={{ fontSize: 13 }}>For</div>
            <div className="row">
              <div className="candidate-avatar" style={{ background: 'var(--green)', color: 'white', borderColor: 'var(--green)' }}>
                {initialsOf(selectedCandidate.name)}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{selectedCandidate.name}</div>
                <div className="muted mono" style={{ fontSize: 12 }}>{selectedCandidate.party} · {selectedCandidate.id}</div>
              </div>
            </div>
            <Alert tone="amber">You can't change your vote once submitted. One vote per election.</Alert>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ==================== CONFIRM ====================
function ConfirmPage({ navigate, voteToken }) {
  const [state, setState] = uS('confirming'); // confirming | success | expired

  uE(() => {
    if (!voteToken) { setState('expired'); return; }
    const t = setTimeout(() => setState('success'), 1400);
    return () => clearTimeout(t);
  }, [voteToken]);

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
              display: 'grid', placeItems: 'center', margin: '0 auto 20px'
            }}>
              <Icon.Check size={28} />
            </div>
            <h2 style={{ marginBottom: 8 }}>Your vote counts 👍</h2>
            <p className="muted" style={{ margin: '0 0 20px' }}>Thank you for participating. Your vote has been recorded anonymously.</p>
            <div className="token-display" style={{ textAlign: 'left' }}>
              <span className="label">Vote ID</span>
              <span style={{ flex: 1 }}>VOTE-{Date.now().toString().slice(-10)}</span>
            </div>
            <div className="row" style={{ marginTop: 24, justifyContent: 'center' }}>
              <Button variant="secondary" onClick={() => navigate('landing')}>Home</Button>
              <Button variant="primary" onClick={() => navigate('results')} trailingIcon={<Icon.ArrowRight />}>
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
              display: 'grid', placeItems: 'center', margin: '0 auto 20px'
            }}>
              <Icon.Warn size={24} />
            </div>
            <h2 style={{ marginBottom: 8 }}>Token expired</h2>
            <p className="muted" style={{ margin: '0 0 20px' }}>This confirmation link is no longer valid. Start a new vote to continue.</p>
            <Button variant="primary" onClick={() => navigate('vote')}>Restart voting</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ==================== RESULTS ====================
function ResultsPage({ navigate }) {
  const [electionId, setElectionId] = uS('ELEC-001');
  const election = window.MOCK_ELECTIONS.find(e => e.id === electionId);
  const candidates = uM(() => {
    const list = [...(window.MOCK_CANDIDATES[electionId] || [])];
    list.sort((a, b) => b.votes - a.votes);
    return list;
  }, [electionId]);
  const total = candidates.reduce((s, c) => s + c.votes, 0);

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="eyebrow">Live results</div>
          <h2 style={{ marginTop: 8 }}>Current standings</h2>
        </div>
        <Select value={electionId} onChange={e => setElectionId(e.target.value)} style={{ width: 260 }}>
          {window.MOCK_ELECTIONS.map(e => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </Select>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div className="card card-lg">
          <div className="card-head" style={{ marginBottom: 20 }}>
            <div>
              <h3>{election.title}</h3>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                {categoryLabel(election.category)} · {prettyEnum(election.state)}
              </div>
            </div>
            <Badge tone="green" dot>Live</Badge>
          </div>
          <div>
            {candidates.map((c, i) => {
              const pct = total ? (c.votes / total) * 100 : 0;
              return (
                <div key={c.id} className="result-row">
                  <div>
                    <div className="result-header">
                      <div className="row" style={{ gap: 10 }}>
                        <div className="candidate-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
                          {initialsOf(c.name)}
                        </div>
                        <div>
                          <div className="result-name">{c.name}</div>
                          <div className="muted mono" style={{ fontSize: 11 }}>{c.party} · {c.id}</div>
                        </div>
                      </div>
                      <div className="result-votes">{c.votes.toLocaleString()} votes</div>
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
          <div className="card">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Leading</div>
            {candidates[0] && (
              <div className="row">
                <div className="candidate-avatar" style={{ background: 'var(--green)', color: 'white', borderColor: 'var(--green)' }}>
                  {initialsOf(candidates[0].name)}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{candidates[0].name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    +{(candidates[0].votes - (candidates[1]?.votes || 0)).toLocaleString()} ahead
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="card">
            <div className="eyebrow" style={{ marginBottom: 10 }}>Window</div>
            <div className="row" style={{ gap: 10 }}>
              <Icon.Calendar size={14} />
              <span style={{ fontSize: 13 }}>{formatDate(election.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="row" style={{ gap: 10, marginTop: 8 }}>
              <Icon.MapPin size={14} />
              <span style={{ fontSize: 13 }}>{prettyEnum(election.state)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LandingPage, RegisterPage, VotePage, ConfirmPage, ResultsPage });
