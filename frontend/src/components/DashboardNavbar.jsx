import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardNavbar({ brandTitle, title, navItems = [], profileLabel = 'User', profileRole = 'User', onNavClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/access');
  };

  return (
    <header className="admin-navbar glass-card">
      <div className="admin-brand-block">
        <div className="brand-mark">TH</div>
        <div>
          <p className="eyebrow">{brandTitle}</p>
          <h1 className="admin-title">{title}</h1>
        </div>
      </div>

      <nav className="admin-nav-links" aria-label="Dashboard navigation">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={item.active ? 'nav-link active' : 'nav-link'}
            onClick={() => onNavClick?.(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="admin-profile-wrap">
        <button
          type="button"
          className="profile-trigger"
          aria-haspopup="menu"
          aria-expanded={profileOpen}
          onClick={() => setProfileOpen((value) => !value)}
        >
          <span className="profile-avatar">{profileLabel?.[0] || 'U'}</span>
          <span className="profile-meta">
            <strong>{profileLabel}</strong>
            <small>{profileRole}</small>
          </span>
          <span className="profile-chevron">⌄</span>
        </button>

        {profileOpen ? (
          <div className="profile-dropdown glass-card" role="menu">
            <button
              type="button"
              className="dropdown-item"
              onClick={() => {
                setProfileOpen(false);
                handleLogout();
              }}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default DashboardNavbar;
