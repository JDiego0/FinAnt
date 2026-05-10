import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import Spinner from '../components/ui/Spinner';
import { toast } from '../utils/alerts';

const fields = [
  { name: 'name',     label: 'Nombre completo',        type: 'text',  placeholder: 'Juan Pérez',    required: true  },
  { name: 'document', label: 'Documento de identidad', type: 'text',  placeholder: '1234567890',    required: true  },
  { name: 'phone',    label: 'Teléfono (opcional)',     type: 'tel',   placeholder: '3001234567',    required: false },
  { name: 'email',    label: 'Correo electrónico',      type: 'email', placeholder: 'tu@correo.com', required: true  },
];

export default function Register() {
  const [form, setForm]       = useState({ name: '', document: '', phone: '', email: '', password: '' });
  const [show, setShow]       = useState(false);
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
      const { data } = await api.post('/auth/register', form);
      login(data);
      toast('success', '¡Cuenta creada exitosamente!');
      navigate('/dashboard');
    } catch (err) {
      const d = err.response?.data;
      setError(typeof d === 'object' ? Object.values(d).join('. ') : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.glow} />

      <div style={{ width: '100%', maxWidth: '460px', padding: '1rem' }}>
        <div className="card" style={S.card}>

          {/* Header dentro del card */}
          <div style={S.header}>
            <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>🐜</span>
            <h1 style={S.brand}>
              Fin<span style={{ color: '#818cf8' }}>Ant</span>
            </h1>
            <p style={S.subtitle}>Gestiona tus finanzas de forma inteligente</p>
          </div>

          <div style={S.divider} />

          <h2 style={S.formTitle}>Crear cuenta</h2>

          {error && <div style={S.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={S.form}>
            {fields.map(f => (
              <div key={f.name}>
                <label className="label">{f.label}</label>
                <input className="input" name={f.name} type={f.type}
                  placeholder={f.placeholder} value={form[f.name]}
                  onChange={handle} required={f.required} />
              </div>
            ))}

            <div>
              <label className="label">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input className="input" name="password"
                  type={show ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres" value={form.password}
                  onChange={handle} required minLength={6}
                  style={{ paddingRight: '2.75rem' }} />
                <button type="button" onClick={() => setShow(!show)} style={S.eyeBtn}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg"
              disabled={loading} style={{ marginTop: '0.25rem' }}>
              {loading
                ? <><Spinner size={18} color="white" />Creando cuenta...</>
                : <><UserPlus size={18} />Crear cuenta</>}
            </button>
          </form>

          <p style={S.switchText}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={S.switchLink}>Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '1.5rem 1rem',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
    width: '500px', height: '500px', borderRadius: '50%', pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)',
  },
  card: { padding: '2rem', animation: 'slideUp 0.4s ease' },
  header: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '0.35rem', paddingBottom: '1.25rem', textAlign: 'center',
  },
  brand: {
    margin: 0, fontSize: '1.6rem', fontWeight: '800',
    color: '#0f172a', letterSpacing: '-0.5px',
  },
  subtitle: { margin: 0, fontSize: '0.82rem', color: '#94a3b8' },
  divider: { height: '1px', background: '#f1f5f9', margin: '0 0 1.25rem' },
  formTitle: { margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: '600', color: '#374151' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.875rem' },
  eyeBtn: {
    position: 'absolute', right: '0.75rem', top: '50%',
    transform: 'translateY(-50%)', background: 'none',
    border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0,
  },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '0.75rem 1rem', borderRadius: '0.625rem',
    fontSize: '0.85rem', marginBottom: '0.5rem',
  },
  switchText: { textAlign: 'center', margin: '1.25rem 0 0', fontSize: '0.85rem', color: '#64748b' },
  switchLink: { color: '#4f46e5', fontWeight: '600', textDecoration: 'none' },
};