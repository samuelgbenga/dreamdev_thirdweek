import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/elections', label: 'Elections' },
  { path: '/admin/candidates', label: 'Candidates' },
  { path: '/admin/voters', label: 'Voters' },
  { path: '/admin/electorates', label: 'Electorates' },
  { path: '/admin/permissions', label: 'Permissions' },
  { path: '/admin/votes', label: 'Votes' },
];

export default function AdminLayout() {
  const { electorateId, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'flex-start' }}>
      <aside style={{ position: 'sticky', top: 80 }}>
        <div className="eyebrow" style={{ marginBottom: 12, paddingLeft: 8 }}>Admin console</div>
        <nav className="stack" style={{ gap: 2 }}>
          {NAV_ITEMS.map(item => (
            <a
              key={item.path}
              href={item.path}
              onClick={e => { e.preventDefault(); navigate(item.path); }}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              style={{ display: 'block' }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16 }}>
          <div className="muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, paddingLeft: 8 }}>
            Signed in
          </div>
          <div className="mono" style={{ fontSize: 12, paddingLeft: 8, marginBottom: 10 }}>{electorateId}</div>
          <button
            className="nav-link"
            style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
