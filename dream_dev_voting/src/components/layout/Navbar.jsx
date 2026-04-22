import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import Button from '../ui/Button';

export default function Navbar() {
  const location = useLocation();
  const { electorateId } = useAdmin();
  const path = location.pathname;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">DV</span>
          <span>Dream Dev Vote</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${path === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/vote" className={`nav-link ${path === '/vote' ? 'active' : ''}`}>Vote</Link>
          <Link to="/results" className={`nav-link ${path === '/results' ? 'active' : ''}`}>Results</Link>
          <Link
            to={electorateId ? '/admin' : '/admin/login'}
            className={`nav-link ${path.startsWith('/admin') ? 'active' : ''}`}
          >
            Admin
          </Link>
        </div>
        <div className="hide-mobile row" style={{ gap: 8 }}>
          {electorateId ? (
            <span className="user-badge">
              <span className="user-badge-dot">EL</span>
              <span className="mono" style={{ fontSize: 11 }}>{electorateId}</span>
            </span>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => {}}>
              <Link to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>Register</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
