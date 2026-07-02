import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>Store Ratings</Link>
      <div style={styles.links}>
        {!user && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </>
        )}

        {user && user.role === 'ADMIN' && (
          <>
            <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/admin/users" style={styles.link}>Users</Link>
            <Link to="/admin/stores" style={styles.link}>Stores</Link>
          </>
        )}

        {user && user.role === 'USER' && (
          <Link to="/stores" style={styles.link}>Stores</Link>
        )}

        {user && user.role === 'STORE_OWNER' && (
          <Link to="/store-owner/dashboard" style={styles.link}>My Store</Link>
        )}

        {user && (
          <>
            <Link to="/update-password" style={styles.link}>Update Password</Link>
            <span style={styles.userInfo}>{user.name} ({user.role})</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#1f2937',
    color: '#fff',
    flexWrap: 'wrap',
  },
  brand: { color: '#fff', fontWeight: 'bold', fontSize: '18px', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  link: { color: '#d1d5db', textDecoration: 'none' },
  userInfo: { color: '#9ca3af', fontSize: '14px' },
  logoutBtn: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;
