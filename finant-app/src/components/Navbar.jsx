import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>💰 FinAnt</span>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/transactions" style={styles.link}>Movimientos</Link>
        <Link to="/notes" style={styles.link}>Notas</Link>
      </div>
      <div style={styles.user}>
        <span style={styles.name}>{user?.name}</span>
        <button onClick={handleLogout} style={styles.logout}>Salir</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '60px', background: '#1a1a2e', color: 'white' },
  brand: { fontWeight: '700', fontSize: '1.2rem' },
  links: { display: 'flex', gap: '1.5rem' },
  link: { color: '#a5b4fc', textDecoration: 'none', fontWeight: '500' },
  user: { display: 'flex', alignItems: 'center', gap: '1rem' },
  name: { fontSize: '0.9rem', color: '#e2e8f0' },
  logout: { padding: '6px 14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};