import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ArrowLeftRight, StickyNote, LogOut, Menu, X } from 'lucide-react';
import { confirm } from '../utils/alerts';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Movimientos', icon: ArrowLeftRight },
  { to: '/notes', label: 'Notas', icon: StickyNote },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const result = await confirm('¿Cerrar sesión?', 'Tu sesión se cerrará en este dispositivo.');
    if (result.isConfirmed) { logout(); navigate('/login'); }
  };

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15,23,42,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 1.5rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          textDecoration: 'none',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🐜</span>
          <span style={{ fontWeight: '700', fontSize: '1.15rem', color: 'white', letterSpacing: '-0.3px' }}>
            Fin<span style={{ color: '#818cf8' }}>Ant</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '0.25rem' }} className="desktop-nav">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500',
                transition: 'all 0.2s',
                background: active ? 'rgba(79,70,229,0.2)' : 'transparent',
                color: active ? '#a5b4fc' : '#94a3b8',
              }}>
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* User + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontSize: '0.8rem', color: '#64748b',
            display: window.innerWidth < 640 ? 'none' : 'block'
          }}>
            {user?.name?.split(' ')[0]}
          </span>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm"
            style={{ color: '#94a3b8' }} title="Cerrar sesión">
            <LogOut size={16} />
          </button>
          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'none' }}
            className="mobile-menu-btn">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 49,
          background: '#0f172a', padding: '1rem', borderBottom: '1px solid #1e293b',
        }}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', borderRadius: '0.5rem',
              color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem',
              marginBottom: '0.25rem',
            }}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}