import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import Spinner from '../components/ui/Spinner';
import { toast } from '../utils/alerts';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast('success', `¡Bienvenido, ${data.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.glow} />

      <div style={{ width: '100%', maxWidth: '420px', padding: '1rem' }}>
        <div className="card" style={S.card}>

          {/* Header dentro del card */}
          <div style={S.header}>
            <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>🐜</span>
            <h1 style={S.brand}>
              Fin<span style={{ color: '#818cf8' }}>Ant</span>
            </h1>
            <p style={S.subtitle}>Tu gestor financiero personal</p>
          </div>

          <div style={S.divider} />

          <h2 style={S.formTitle}>Iniciar sesión</h2>

          {error && <div style={S.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={S.form}>
            <div>
              <label className="label">Correo electrónico</label>
              <input className="input" name="email" type="email"
                placeholder="tu@correo.com" value={form.email}
                onChange={handle} required />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <label className="label" style={{ margin: 0 }}>Contraseña</label>
                <Link to="/forgot-password" style={S.forgotLink}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input className="input" name="password"
                type="password"
                placeholder="••••••••" value={form.password}
                onChange={handle} required />
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg"
              disabled={loading} style={{ marginTop: '0.25rem' }}>
              {loading
                ? <><Spinner size={18} color="white" />Ingresando...</>
                : <><LogIn size={18} />Ingresar</>}
            </button>
          </form>

          <p style={S.switchText}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={S.switchLink}>Regístrate gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '1rem',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
    width: '500px', height: '500px', borderRadius: '50%', pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)',
  },
  card: {
    padding: '2rem', animation: 'slideUp 0.4s ease',
  },
  header: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '0.4rem', paddingBottom: '1.25rem', textAlign: 'center',
  },
  brand: {
    margin: 0, fontSize: '1.75rem', fontWeight: '800',
    color: '#0f172a', letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: 0, fontSize: '0.82rem', color: '#94a3b8',
  },
  divider: {
    height: '1px', background: '#f1f5f9', margin: '0 0 1.25rem',
  },
  formTitle: {
    margin: '0 0 1.25rem', fontSize: '1rem',
    fontWeight: '600', color: '#374151',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  forgotLink: {
    fontSize: '0.78rem', color: '#4f46e5',
    textDecoration: 'none', fontWeight: '500',
  },

  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '0.75rem 1rem', borderRadius: '0.625rem',
    fontSize: '0.85rem', marginBottom: '1rem',
  },
  switchText: {
    textAlign: 'center', margin: '1.25rem 0 0',
    fontSize: '0.85rem', color: '#64748b',
  },
  switchLink: { color: '#4f46e5', fontWeight: '600', textDecoration: 'none' },
};