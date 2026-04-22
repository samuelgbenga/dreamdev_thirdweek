import { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { candidateService } from '../../services/candidateService';
import { initialsOf } from '../../utils/formatDate';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import CsvDropzone from '../../components/forms/CsvDropzone';
import CsvPreviewTable from '../../components/forms/CsvPreviewTable';

const PREVIEW_ROWS = [
  { candidateId: 'CAND-N01', name: 'Emeka Obi', party: 'APC', electionId: 'ELEC-008' },
  { candidateId: 'CAND-N02', name: 'Ifeoma Nnadi', party: 'PDP', electionId: 'ELEC-008' },
];

export default function AdminCandidatesPage() {
  const { electorateId } = useAdmin();
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [electionFilter, setElectionFilter] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    try {
      await candidateService.uploadCandidates(electorateId, file);
      setUploaded(true);
      setFile(null);
    } catch {
      setUploaded(false);
    } finally {
      setUploading(false);
    }
  }

  async function search() {
    if (!electionFilter) return;
    setLoading(true);
    try {
      const res = await candidateService.getCandidatesByElectionId(electionFilter);
      setCandidates(res.data ?? []);
    } catch {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }

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
          <CsvDropzone onFile={f => { setFile(f); setUploaded(false); }} file={file} />
          {file && (
            <>
              <div className="muted" style={{ fontSize: 13 }}>Preview</div>
              <CsvPreviewTable rows={PREVIEW_ROWS} headers={['candidateId', 'name', 'party', 'electionId']} />
              <div className="row" style={{ justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => { setFile(null); setUploaded(false); }}>Cancel</Button>
                <Button variant="primary" onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Uploading…' : `Upload ${PREVIEW_ROWS.length} candidates`}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>All candidates</h3>
          <div className="row">
            <input
              className="input"
              placeholder="Election ID (e.g. ELEC-001)"
              value={electionFilter}
              onChange={e => setElectionFilter(e.target.value)}
              style={{ width: 220 }}
            />
            <Button variant="secondary" size="sm" onClick={search} disabled={!electionFilter || loading}>Search</Button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Party</th><th>Election</th><th style={{ textAlign: 'right' }}>Votes</th></tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.candidateId ?? c.id}>
                <td className="mono" style={{ fontSize: 12 }}>{c.candidateId ?? c.id}</td>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="candidate-avatar" style={{ width: 28, height: 28, fontSize: 10 }}>
                      {initialsOf(c.candidateName ?? c.name ?? '')}
                    </div>
                    <span>{c.candidateName ?? c.name}</span>
                  </div>
                </td>
                <td><Badge>{c.party}</Badge></td>
                <td className="mono" style={{ fontSize: 12 }}>{c.electionId}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{(c.voteCount ?? c.votes ?? 0).toLocaleString()}</td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--ink-subtle)', padding: 32 }}>Search by election ID above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
