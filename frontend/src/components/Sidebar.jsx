import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" /></svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
);

export default function Sidebar() {
  const { username, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <Link to="/" className="brand">PulseFeed</Link>
      {isAuthenticated ? (
        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link"><HomeIcon /><span>Home</span></Link>
          <Link to="/search" className="sidebar-link"><SearchIcon /><span>Search</span></Link>
          <Link to={`/profile/${username}`} className="sidebar-link"><UserIcon /><span>Profile</span></Link>
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}><LogoutIcon /><span>Logout</span></button>
        </nav>
      ) : (
        <nav className="sidebar-nav">
          <Link to="/login" className="sidebar-link"><UserIcon /><span>Login</span></Link>
          <Link to="/register" className="sidebar-link"><UserIcon /><span>Register</span></Link>
        </nav>
      )}
    </aside>
  );
}
