// Admin pages for Dream Dev Vote

const aS = React.useState;
const aE = React.useEffect;
const aM = React.useMemo;

// ==================== MOCK ADMIN DATA ====================
const MOCK_ELECTORATES = [
  { id: 'ELECTORATE-001', name: 'Amaka Nwosu', permissions: ['CAN_APPROVE_VOTER', 'CAN_UPLOAD_FILE', 'CAN_VIEW_METRICS', 'CAN_VIEW_VOTE', 'CAN_VIEW_ELECTORATE'] },
  { id: 'ELECTORATE-002', name: 'Babatunde Salako', permissions: ['CAN_APPROVE_VOTER', 'CAN_VIEW_VOTE'] },
  { id: 'ELECTORATE-003', name: 'Chidinma Eze', permissions: ['CAN_UPLOAD_FILE', 'CAN_VIEW_METRICS'] },
];

const MOCK_VOTERS = [
  { id: 'NIG-LA-48201934', firstName: 'Adaeze', lastName: 'Okonkwo', state: 'LAGOS', status: 'PENDING', dob: '1995-03-12', citizenship: 'REGISTRATION' },
  { id: 'NIG-LA-48201935', firstName: 'Tunde', lastName: 'Bakare', state: 'LAGOS', status: 'APPROVED', dob: '1988-11-02', citizenship: 'REGISTRATION' },
  { id: 'NIG-KA-48201936', firstName: 'Hafsat', lastName: 'Garba', state: 'KANO', status: 'APPROVED', dob: '1990-07-22', citizenship: 'REGISTRATION' },
  { id: 'NIG-RI-48201937', firstName: 'Soboma', lastName: 'West', state: 'RIVERS', status: 'PENDING', dob: '1992-01-05', citizenship: 'NATURALIZATION' },
  { id: 'NIG-OY-48201938', firstName: 'Folake', lastName: 'Adeyemi', state: 'OYO', status: 'PENDING', dob: '1994-09-18', citizenship: 'REGISTRATION' },
  { id: 'NIG-FC-48201939', firstName: 'Musa', lastName: 'Abdullahi', state: 'FCT', status: 'APPROVED', dob: '1987-05-30', citizenship: 'DUAL_CITIZENSHIP' },
  { id: 'NIG-AN-48201940', firstName: 'Chinedu', lastName: 'Obi', state: 'ANAMBRA', status: 'PENDING', dob: '1996-12-01', citizenship: 'REGISTRATION' },
  { id: 'NIG-KD-48201941', firstName: 'Aisha', lastName: 'Yusuf', state: 'KADUNA', status: 'APPROVED', dob: '1991-04-14', citizenship: 'REGISTRATION' },
];

const MOCK_VOTES = Array.from({ length: 42 }, (_, i) => {
  const elections = window.MOCK_ELECTIONS;
  const elec = elections[i % elections.length];
  const cands = window.MOCK_CANDIDATES[elec.id] || [];
  const cand = cands[i % Math.max(cands.length, 1)] || { id: 'CAND-?' };
  const status = i % 7 === 0 ? 'DEFAULTED' : 'VOTED';
  return {
    electionId: elec.id,
    candidateId: cand.id,
    hashedVoterId: 'sha256:' + Math.random().toString(36).slice(2, 12) + '…',
    status,
    createdAt: `2026-05-${String((i % 17) + 1).padStart(2, '0')} 09:${String((i * 7) % 60).padStart(2, '0')}`,
    updatedAt: `2026-05-${String((i % 17) + 1).padStart(2, '0')} 09:${String(((i * 7) + 3) % 60).padStart(2, '0')}`,
  };
});

const PERMISSIONS = [
  'CAN_VOTE', 'CAN_UPLOAD_FILE', 'CAN_APPROVE_VOTER',
  'CAN_VIEW_METRICS', 'CAN_VIEW_ELECTORATE', 'CAN_VIEW_VOTE',
  'CAN_UPDATE_ELECTORATE'
];

Object.assign(window, { MOCK_ELECTORATES, MOCK_VOTERS, MOCK_VOTES, PERMISSIONS });

// ==================== ADMIN LAYOUT ====================
function AdminLayout({ children, route, navigate, electorateId, onLogout }) {
  const items = [
    { id: 'admin', label: 'Dashboard' },
    { id: 'admin/elections', label: 'Elections' },
    { id: 'admin/candidates', label: 'Candidates' },
    { id: 'admin/voters', label: 'Voters' },
    { id: 'admin/electorates', label: 'Electorates' },
    { id: 'admin/permissions', label: 'Permissions' },
    { id: 'admin/votes', label: 'Votes' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'flex-start' }}>
      <aside style={{ position: 'sticky', top: 80 }}>
        <div className="eyebrow" style={{ marginBottom: 12, paddingLeft: 8 }}>Admin console</div>
        <nav className="stack" style={{ gap: 2 }}>
          {items.map(it => (
            <a key={it.id} href="#" onClick={e => { e.preventDefault(); navigate(it.id); }}
              className={`nav-link ${route === it.id ? 'active' : ''}`}
              style={{ display: 'block' }}>
              {it.label}
            </a>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16 }}>
          <div className="muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, paddingLeft: 8 }}>Signed in</div>
          <div className="mono" style={{ fontSize: 12, paddingLeft: 8, marginBottom: 10 }}>{electorateId}</div>
          <button className="nav-link" style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'var(--danger)' }}
            onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>
      <div>{children}</div>
    </div>
  );
}

// ==================== ADMIN LOGIN ====================
function AdminLoginPage({ onLogin, navigate }) {
  const [id, setId] = aS('');
  const [error, setError] = aS('');
  const submit = (e) => {
    e.preventDefault();
    const found = MOCK_ELECTORATES.find(el => el.id === id.trim().toUpperCase());
    if (!found) {
      setError('Electorate not found. Try ELECTORATE-001.');
      return;
    }
    try { localStorage.setItem('ddv_electorateId', found.id); } catch {}
    onLogin(found.id);
  };
  return (
    <div style={{ maxWidth: 440, margin: '48px auto' }}>
      <div className="card card-lg">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: 'var(--green-soft)',
            color: 'var(--green-deep)', display: 'grid', placeItems: 'center', margin: '0 auto 14px'
          }}>
            <Icon.Shield size={20} />
          </div>
          <h2 style={{ marginBottom: 6 }}>Electorate sign in</h2>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>Enter your Electorate ID to access the admin console.</p>
        </div>
        <form onSubmit={submit} className="stack">
          <Field label="Electorate ID" error={error} hint="Try ELECTORATE-001, -002 or -003">
            <Input value={id} onChange={e => { setId(e.target.value); setError(''); }} placeholder="ELECTORATE-001" />
          </Field>
          <Button variant="primary" type="submit" fullWidth>Sign in</Button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="#" onClick={e => { e.preventDefault(); navigate('landing'); }} style={{ fontSize: 13 }}>← Back to public site</a>
        </div>
      </div>
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================
function AdminDashboardPage({ navigate }) {
  const stats = [
    { label: 'Total voters', value: MOCK_VOTERS.length, sub: `${MOCK_VOTERS.filter(v => v.status === 'PENDING').length} pending`, to: 'admin/voters' },
    { label: 'Elections', value: window.MOCK_ELECTIONS.length, sub: 'Upcoming & active', to: 'admin/elections' },
    { label: 'Candidates', value: Object.values(window.MOCK_CANDIDATES).flat().length, sub: 'Across all elections', to: 'admin/candidates' },
    { label: 'Votes cast', value: MOCK_VOTES.filter(v => v.status === 'VOTED').length, sub: `${MOCK_VOTES.filter(v => v.status === 'DEFAULTED').length} defaulted`, to: 'admin/votes' },
  ];
  const pending = MOCK_VOTERS.filter(v => v.status === 'PENDING').slice(0, 4);

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div>
        <div className="eyebrow">Overview</div>
        <h2 style={{ marginTop: 8 }}>Dashboard</h2>
      </div>

      <div className="grid grid-4">
        {stats.map(s => (
          <button key={s.label} onClick={() => navigate(s.to)} className="card" style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)' }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{s.sub}</div>
          </button>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-head">
            <h3>Pending approvals</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('admin/voters')} trailingIcon={<Icon.ArrowRight />}>View all</Button>
          </div>
          {pending.length === 0 && <div className="muted">Nothing to review.</div>}
          {pending.map(v => (
            <div key={v.id} className="row-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="row" style={{ gap: 10 }}>
                <div className="candidate-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>{initialsOf(v.firstName + ' ' + v.lastName)}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{v.firstName} {v.lastName}</div>
                  <div className="muted mono" style={{ fontSize: 11 }}>{v.id} · {prettyEnum(v.state)}</div>
                </div>
              </div>
              <Badge tone="amber" dot>Pending</Badge>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-head"><h3>Quick actions</h3></div>
          <div className="stack" style={{ gap: 8 }}>
            <Button variant="secondary" fullWidth onClick={() => navigate('admin/elections')}>Upload elections CSV</Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('admin/candidates')}>Upload candidates CSV</Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('admin/electorates')}>Create electorate</Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('admin/permissions')}>Assign permission</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== CSV DROPZONE ====================
function CsvDropzone({ onFile, file }) {
  const [drag, setDrag] = aS(false);
  const inputRef = React.useRef();
  const onChange = (e) => {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith('.csv')) onFile(f);
  };
  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.endsWith('.csv')) onFile(f);
  };
  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      style={{
        border: `1.5px dashed ${drag ? 'var(--green)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius)',
        padding: 24,
        textAlign: 'center',
        background: drag ? 'var(--green-soft)' : 'var(--bg)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <input ref={inputRef} type="file" accept=".csv" onChange={onChange} style={{ display: 'none' }} />
      {file ? (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>{file.name}</div>
          <div className="muted" style={{ fontSize: 12 }}>{(file.size / 1024).toFixed(1)} KB · Click to replace</div>
        </div>
      ) : (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>Drop a .csv file here</div>
          <div className="muted" style={{ fontSize: 13 }}>or click to browse</div>
        </div>
      )}
    </div>
  );
}

function CsvPreviewTable({ rows, headers }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div style={{ overflow: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
      <table className="table">
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{headers.map(h => <td key={h} className="mono" style={{ fontSize: 12 }}>{r[h]}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==================== ADMIN ELECTIONS ====================
function AdminElectionsPage() {
  const [file, setFile] = aS(null);
  const [uploaded, setUploaded] = aS(false);
  const [stateFilter, setStateFilter] = aS('ALL');
  const [dateFilter, setDateFilter] = aS('');

  const previewRows = file ? [
    { electionId: 'ELEC-008', category: 'PRESIDENTIAL', state: 'NATIONAL', date: '2026-08-10', window: '08:00-17:00' },
    { electionId: 'ELEC-009', category: 'SENATORIAL', state: 'KADUNA', date: '2026-08-10', window: '08:00-16:00' },
    { electionId: 'ELEC-010', category: 'GUBERNATORIAL', state: 'ENUGU', date: '2026-09-14', window: '08:00-17:00' },
  ] : [];

  const elections = aM(() =>
    window.MOCK_ELECTIONS.filter(e =>
      (stateFilter === 'ALL' || e.state === stateFilter) &&
      (!dateFilter || e.date === dateFilter)
    )
  , [stateFilter, dateFilter]);

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div>
        <div className="eyebrow">Manage</div>
        <h2 style={{ marginTop: 8 }}>Elections</h2>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Upload elections CSV</h3>
          {uploaded && <Badge tone="green" dot>Uploaded</Badge>}
        </div>
        <div className="stack">
          <CsvDropzone onFile={(f) => { setFile(f); setUploaded(false); }} file={file} />
          {file && (
            <>
              <div className="muted" style={{ fontSize: 13 }}>Preview (first 3 rows)</div>
              <CsvPreviewTable rows={previewRows} headers={['electionId', 'category', 'state', 'date', 'window']} />
              <div className="row" style={{ justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => { setFile(null); setUploaded(false); }}>Cancel</Button>
                <Button variant="primary" onClick={() => setUploaded(true)}>Upload {previewRows.length} elections</Button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>All elections</h3>
          <div className="row">
            <Select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={{ width: 160 }}>
              <option value="ALL">All states</option>
              {window.STATES.map(s => <option key={s} value={s}>{prettyEnum(s)}</option>)}
            </Select>
            <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: 160 }} />
          </div>
        </div>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Category</th><th>State</th><th>Date</th><th>Window</th></tr>
          </thead>
          <tbody>
            {elections.map(e => (
              <tr key={e.id}>
                <td className="mono" style={{ fontSize: 12 }}>{e.id}</td>
                <td><Badge tone="green">{categoryLabel(e.category)}</Badge></td>
                <td>{prettyEnum(e.state)}</td>
                <td>{formatDate(e.date, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td className="mono" style={{ fontSize: 12 }}>{e.startsAt}–{e.endsAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== ADMIN CANDIDATES ====================
function AdminCandidatesPage() {
  const [file, setFile] = aS(null);
  const [uploaded, setUploaded] = aS(false);
  const [electionFilter, setElectionFilter] = aS('ALL');

  const previewRows = file ? [
    { candidateId: 'CAND-N01', name: 'Emeka Obi', party: 'APC', electionId: 'ELEC-008' },
    { candidateId: 'CAND-N02', name: 'Ifeoma Nnadi', party: 'PDP', electionId: 'ELEC-008' },
  ] : [];

  const candidates = aM(() => {
    const all = [];
    Object.entries(window.MOCK_CANDIDATES).forEach(([eid, list]) => {
      if (electionFilter !== 'ALL' && eid !== electionFilter) return;
      list.forEach(c => all.push({ ...c, electionId: eid }));
    });
    return all;
  }, [electionFilter]);

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div>
        <div className="eyebrow">Manage</div>
        <h2 style={{ marginTop: 8 }}>Candidates</h2>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Upload candidates CSV</h3>
          {uploaded && <Badge tone="green" dot>Uploaded</Badge>}
        </div>
        <div className="stack">
          <CsvDropzone onFile={(f) => { setFile(f); setUploaded(false); }} file={file} />
          {file && (
            <>
              <div className="muted" style={{ fontSize: 13 }}>Preview</div>
              <CsvPreviewTable rows={previewRows} headers={['candidateId', 'name', 'party', 'electionId']} />
              <div className="row" style={{ justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => { setFile(null); setUploaded(false); }}>Cancel</Button>
                <Button variant="primary" onClick={() => setUploaded(true)}>Upload {previewRows.length} candidates</Button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>All candidates</h3>
          <Select value={electionFilter} onChange={e => setElectionFilter(e.target.value)} style={{ width: 260 }}>
            <option value="ALL">All elections</option>
            {window.MOCK_ELECTIONS.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </Select>
        </div>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Party</th><th>Election</th><th style={{ textAlign: 'right' }}>Votes</th></tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id}>
                <td className="mono" style={{ fontSize: 12 }}>{c.id}</td>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="candidate-avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{initialsOf(c.name)}</div>
                    <span>{c.name}</span>
                  </div>
                </td>
                <td><Badge>{c.party}</Badge></td>
                <td className="mono" style={{ fontSize: 12 }}>{c.electionId}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.votes.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== ADMIN VOTERS ====================
function AdminVotersPage() {
  const [tab, setTab] = aS('ALL');
  const [query, setQuery] = aS('');
  const [voters, setVoters] = aS(MOCK_VOTERS);
  const [toast, setToast] = aS(null);

  const filtered = aM(() => {
    let list = voters;
    if (tab !== 'ALL') list = list.filter(v => v.status === tab);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(v =>
        v.id.toLowerCase().includes(q) ||
        `${v.firstName} ${v.lastName}`.toLowerCase().includes(q)
      );
    }
    return list;
  }, [voters, tab, query]);

  const approve = (id) => {
    setVoters(vs => vs.map(v => v.id === id ? { ...v, status: 'APPROVED' } : v));
    setToast(`Approved ${id}`);
    setTimeout(() => setToast(null), 2000);
  };

  const counts = {
    ALL: voters.length,
    PENDING: voters.filter(v => v.status === 'PENDING').length,
    APPROVED: voters.filter(v => v.status === 'APPROVED').length,
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div>
        <div className="eyebrow">Manage</div>
        <h2 style={{ marginTop: 8 }}>Voters</h2>
      </div>

      <div className="card">
        <div className="card-head" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div className="row" style={{ gap: 4, background: 'var(--bg)', padding: 4, borderRadius: 'var(--radius)' }}>
            {[
              ['ALL', 'All'],
              ['PENDING', 'Pending'],
              ['APPROVED', 'Approved']
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  background: tab === key ? 'var(--surface)' : 'transparent',
                  color: tab === key ? 'var(--ink)' : 'var(--ink-muted)',
                  boxShadow: tab === key ? 'var(--shadow-sm)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {label} <span style={{ opacity: 0.5, marginLeft: 4 }}>{counts[key]}</span>
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-subtle)' }}>
              <Icon.Search size={14} />
            </span>
            <Input placeholder="Search by ID or name" value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 34, width: 260 }} />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr><th>Voter ID</th><th>Name</th><th>State</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id}>
                <td className="mono" style={{ fontSize: 12 }}>{v.id}</td>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="candidate-avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{initialsOf(v.firstName + ' ' + v.lastName)}</div>
                    <span>{v.firstName} {v.lastName}</span>
                  </div>
                </td>
                <td>{prettyEnum(v.state)}</td>
                <td>
                  {v.status === 'APPROVED'
                    ? <Badge tone="green" dot>Approved</Badge>
                    : <Badge tone="amber" dot>Pending</Badge>}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {v.status === 'PENDING' && (
                    <Button variant="primary" size="sm" onClick={() => approve(v.id)} icon={<Icon.Check />}>Approve</Button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--ink-subtle)', padding: 32 }}>No voters match.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--ink)', color: 'white', padding: '10px 16px', borderRadius: 'var(--radius)',
          fontSize: 13, boxShadow: 'var(--shadow-lg)', zIndex: 300
        }}>{toast}</div>
      )}
    </div>
  );
}

// ==================== ADMIN ELECTORATES ====================
function AdminElectoratesPage() {
  const [list, setList] = aS(MOCK_ELECTORATES);
  const [showForm, setShowForm] = aS(false);
  const [form, setForm] = aS({ firstName: '', lastName: '', dob: '', citizenship: 'REGISTRATION', newId: '' });
  const upd = (k, v) => setForm({ ...form, [k]: v });
  const create = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.newId) return;
    setList([...list, {
      id: form.newId.toUpperCase(),
      name: `${form.firstName} ${form.lastName}`,
      permissions: ['CAN_VIEW_METRICS']
    }]);
    setForm({ firstName: '', lastName: '', dob: '', citizenship: 'REGISTRATION', newId: '' });
    setShowForm(false);
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="row-between">
        <div>
          <div className="eyebrow">Manage</div>
          <h2 style={{ marginTop: 8 }}>Electorates</h2>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New electorate'}
        </Button>
      </div>

      {showForm && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Create electorate</h3>
          <form onSubmit={create} className="stack">
            <div className="grid grid-2">
              <Field label="First name"><Input value={form.firstName} onChange={e => upd('firstName', e.target.value)} /></Field>
              <Field label="Last name"><Input value={form.lastName} onChange={e => upd('lastName', e.target.value)} /></Field>
            </div>
            <div className="grid grid-2">
              <Field label="Date of birth"><Input type="date" value={form.dob} onChange={e => upd('dob', e.target.value)} /></Field>
              <Field label="Citizenship">
                <Select value={form.citizenship} onChange={e => upd('citizenship', e.target.value)}>
                  {window.CITIZENSHIP_TYPES.map(c => <option key={c} value={c}>{prettyEnum(c)}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="New electorate ID" hint="e.g. ELECTORATE-004">
              <Input value={form.newId} onChange={e => upd('newId', e.target.value)} placeholder="ELECTORATE-004" />
            </Field>
            <div className="muted" style={{ fontSize: 12 }}>
              Assigner ID auto-filled from your session.
            </div>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <Button variant="primary" type="submit">Create electorate</Button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-head"><h3>All electorates</h3></div>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Permissions</th></tr>
          </thead>
          <tbody>
            {list.map(el => (
              <tr key={el.id}>
                <td className="mono" style={{ fontSize: 12 }}>{el.id}</td>
                <td>{el.name}</td>
                <td>
                  <div className="row wrap" style={{ gap: 4 }}>
                    {el.permissions.map(p => <Badge key={p}>{p.replace('CAN_', '').toLowerCase().replace(/_/g, ' ')}</Badge>)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== ADMIN PERMISSIONS ====================
function AdminPermissionsPage() {
  const [assignForm, setAssignForm] = aS({ userId: '', perm: PERMISSIONS[0] });
  const [removeForm, setRemoveForm] = aS({ userId: '', perm: PERMISSIONS[0] });
  const [log, setLog] = aS([]);

  const assign = (e) => {
    e.preventDefault();
    if (!assignForm.userId) return;
    setLog([{ action: 'assigned', ...assignForm, ts: new Date().toLocaleTimeString() }, ...log]);
    setAssignForm({ userId: '', perm: PERMISSIONS[0] });
  };
  const remove = (e) => {
    e.preventDefault();
    if (!removeForm.userId) return;
    setLog([{ action: 'removed', ...removeForm, ts: new Date().toLocaleTimeString() }, ...log]);
    setRemoveForm({ userId: '', perm: PERMISSIONS[0] });
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div>
        <div className="eyebrow">Manage</div>
        <h2 style={{ marginTop: 8 }}>Permissions</h2>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Assign permission</h3>
          <form onSubmit={assign} className="stack">
            <Field label="User ID" hint="Voter ID or Electorate ID">
              <Input value={assignForm.userId} onChange={e => setAssignForm({ ...assignForm, userId: e.target.value })} placeholder="NIG-LA-... or ELECTORATE-..." />
            </Field>
            <Field label="Permission">
              <Select value={assignForm.perm} onChange={e => setAssignForm({ ...assignForm, perm: e.target.value })}>
                {PERMISSIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </Select>
            </Field>
            <Button variant="primary" type="submit" fullWidth>Assign</Button>
          </form>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Remove permission</h3>
          <form onSubmit={remove} className="stack">
            <Field label="User ID">
              <Input value={removeForm.userId} onChange={e => setRemoveForm({ ...removeForm, userId: e.target.value })} placeholder="NIG-LA-... or ELECTORATE-..." />
            </Field>
            <Field label="Permission">
              <Select value={removeForm.perm} onChange={e => setRemoveForm({ ...removeForm, perm: e.target.value })}>
                {PERMISSIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </Select>
            </Field>
            <Button variant="secondary" type="submit" fullWidth>Remove</Button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Recent activity</h3></div>
        {log.length === 0 && <div className="muted" style={{ textAlign: 'center', padding: 20 }}>No activity yet in this session.</div>}
        {log.map((l, i) => (
          <div key={i} className="row-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
            <div className="row" style={{ gap: 10 }}>
              <Badge tone={l.action === 'assigned' ? 'green' : 'red'}>{l.action}</Badge>
              <span className="mono" style={{ fontSize: 12 }}>{l.perm}</span>
              <span className="muted">→</span>
              <span className="mono" style={{ fontSize: 12 }}>{l.userId}</span>
            </div>
            <span className="muted" style={{ fontSize: 12 }}>{l.ts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== ADMIN VOTES ====================
function AdminVotesPage() {
  const [page, setPage] = aS(0);
  const pageSize = 10;
  const total = MOCK_VOTES.length;
  const pages = Math.ceil(total / pageSize);
  const rows = MOCK_VOTES.slice(page * pageSize, (page + 1) * pageSize);

  const summaryElection = window.MOCK_ELECTIONS[0];
  const summaryCands = [...(window.MOCK_CANDIDATES[summaryElection.id] || [])].sort((a, b) => b.votes - a.votes);

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
            <div className="muted" style={{ fontSize: 13 }}>{total.toLocaleString()} records</div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Election</th><th>Candidate</th><th>Voter (hash)</th><th>Status</th><th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="mono" style={{ fontSize: 12 }}>{r.electionId}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{r.candidateId}</td>
                  <td className="mono" style={{ fontSize: 11, color: 'var(--ink-subtle)' }}>{r.hashedVoterId}</td>
                  <td>
                    {r.status === 'VOTED'
                      ? <Badge tone="green" dot>Voted</Badge>
                      : <Badge tone="red" dot>Defaulted</Badge>}
                  </td>
                  <td className="mono" style={{ fontSize: 12 }}>{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row-between" style={{ marginTop: 16 }}>
            <div className="muted" style={{ fontSize: 13 }}>
              Page {page + 1} of {pages}
            </div>
            <div className="row">
              <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Button variant="secondary" size="sm" disabled={page + 1 >= pages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Election summary</h3></div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{summaryElection.title}</div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>{summaryElection.id}</div>
          {summaryCands.map((c, i) => {
            const max = summaryCands[0].votes;
            const pct = (c.votes / max) * 100;
            return (
              <div key={c.id} style={{ marginBottom: 10 }}>
                <div className="row-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{c.name}</span>
                  <span className="mono" style={{ fontSize: 12 }}>{c.votes.toLocaleString()}</span>
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

Object.assign(window, {
  AdminLayout,
  AdminLoginPage,
  AdminDashboardPage,
  AdminElectionsPage,
  AdminCandidatesPage,
  AdminVotersPage,
  AdminElectoratesPage,
  AdminPermissionsPage,
  AdminVotesPage,
});
