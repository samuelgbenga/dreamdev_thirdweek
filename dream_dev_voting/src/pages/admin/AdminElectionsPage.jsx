import { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useElections } from '../../hooks/useElections';
import { electionService } from '../../services/electionService';
import { STATE } from '../../constants/enums';
import { prettyEnum, categoryLabel, formatDate } from '../../utils/formatDate';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import CsvDropzone from '../../components/forms/CsvDropzone';
import CsvPreviewTable from '../../components/forms/CsvPreviewTable';

const PREVIEW_ROWS = [
  { electionId: 'ELEC-008', category: 'PRESIDENTIAL', state: 'NATIONAL', date: '2026-08-10', window: '08:00-17:00' },
  { electionId: 'ELEC-009', category: 'SENATORIAL', state: 'KADUNA', date: '2026-08-10', window: '08:00-16:00' },
  { electionId: 'ELEC-010', category: 'GUBERNATORIAL', state: 'ENUGU', date: '2026-09-14', window: '08:00-17:00' },
];

export default function AdminElectionsPage() {
  const { electorateId } = useAdmin();
  const { elections } = useElections();
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stateFilter, setStateFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = useMemo(() =>
    elections.filter(e =>
      (stateFilter === 'ALL' || e.state === stateFilter) &&
      (!dateFilter || (e.date ?? e.electionDate) === dateFilter)
    )
  , [elections, stateFilter, dateFilter]);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    try {
      await electionService.uploadElections(electorateId, file);
      setUploaded(true);
      setFile(null);
    } catch {
      setUploaded(false);
    } finally {
      setUploading(false);
    }
  }

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
          <CsvDropzone onFile={f => { setFile(f); setUploaded(false); }} file={file} />
          {file && (
            <>
              <div className="muted" style={{ fontSize: 13 }}>Preview (first 3 rows)</div>
              <CsvPreviewTable rows={PREVIEW_ROWS} headers={['electionId', 'category', 'state', 'date', 'window']} />
              <div className="row" style={{ justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => { setFile(null); setUploaded(false); }}>Cancel</Button>
                <Button variant="primary" onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Uploading…' : `Upload ${PREVIEW_ROWS.length} elections`}
                </Button>
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
              {STATE.map(s => <option key={s} value={s}>{prettyEnum(s)}</option>)}
            </Select>
            <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: 160 }} />
          </div>
        </div>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Category</th><th>State</th><th>Date</th><th>Window</th></tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.electionId ?? e.id}>
                <td className="mono" style={{ fontSize: 12 }}>{e.electionId ?? e.id}</td>
                <td><Badge tone="green">{categoryLabel(e.category)}</Badge></td>
                <td>{prettyEnum(e.state)}</td>
                <td>{formatDate(e.date ?? e.electionDate ?? '', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td className="mono" style={{ fontSize: 12 }}>{e.startsAt ?? e.startTime}–{e.endsAt ?? e.endTime}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--ink-subtle)', padding: 32 }}>No elections found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
