import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import api from '../api/axiosConfig';
import Spinner from '../components/ui/Spinner';
import { toast } from '../utils/alerts';

// ── PageWrapper FUERA del componente principal ──────────────────────
function PageWrapper({ children }) {
  return (
    <div style={S.page}>
      <div style={S.glow} />
      <div style={{ width: '100%', maxWidth: '420px', padding: '1rem' }}>
        <div className="card" style={S.card}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const token      = params.get('token');

  const [status,  setStatus]  = useState('validating');
  const [form,    setForm]    = useState({ newPassword: '', confirmPassword: '' });
  const [showP1,  setShowP1]  = useState(false);
  const [showP2,  setShowP2]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }
    api.get(`/auth/validate-token?token=${token}`)
      .then(({ data }) => setStatus(data.valid ? 'valid' : 'invalid'))
      .catch(()        => setStatus('invalid'));
  }, [token]);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, ...form });
      setStatus('success');
      toast('success', '¡Contraseña actualizada!');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'El enlace es inválido o ya expiró');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = form.confirmPassword.length > 0 &&
    form.newPassword === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword.length > 0 &&
    form.newPassword !== form.confirmPassword;

  // ── Validando token ────────────────────────────────────────────────
  if (status === 'validating') return (
    <PageWrapper>
      <div style={S.center}>
        <Spinner size={36} />
        <p style={S.loadingText}>Verificando enlace...</p>
      </div>
    </PageWrapper>
  );

  // ── Token inválido ─────────────────────────────────────────────────
  if (status === 'invalid') return (
    <PageWrapper>
      <div style={S.center}>
        <div style={{ ...S.iconWrap, background: '#fef2f2' }}>
          <XCircle size={26} color="#dc2626" />
        </div>
        <h2 style={S.stateTitle}>Enlace inválido o expirado</h2>
        <p style={S.stateDesc}>
          Este enlace ya fue usado o expiró. Los enlaces son válidos por 30 minutos.
        </p>
        <Link
          to="/forgot-password"
          className="btn btn-primary btn-full"
          style={{ marginTop: '1.5rem', textDecoration: 'none', display: 'flex' }}
        >
          Solicitar nuevo enlace
        </Link>
        <div style={S.back}>
          <Link to="/login" style={S.backLink}>
            <ArrowLeft size={14} /> Volver al login
          </Link>
        </div>
      </div>
    </PageWrapper>
  );

  // ── Éxito ──────────────────────────────────────────────────────────
  if (status === 'success') return (
    <PageWrapper>
      <div style={S.center}>
        <div style={{ ...S.iconWrap, background: '#f0fdf4' }}>
          <CheckCircle size={26} color="#16a34a" />
        </div>
        <h2 style={S.stateTitle}>¡Contraseña actualizada!</h2>
        <p style={S.stateDesc}>
          Tu contraseña fue cambiada exitosamente. Redirigiendo al login...
        </p>
        <div style={{ marginTop: '1.25rem' }}>
          <Spinner size={22} color="#4f46e5" />
        </div>
      </div>
    </PageWrapper>
  );

  // ── Formulario ─────────────────────────────────────────────────────
  return (
    <PageWrapper>
      <div style={S.header}>
        <div style={S.iconWrap}>
          <Lock size={22} color="#4f46e5" />
        </div>
        <h1 style={S.brand}>
          Fin<span style={{ color: '#818cf8' }}>Ant</span>
        </h1>
        <p style={S.subtitle}>Establece tu nueva contraseña</p>
      </div>

      <div style={S.divider} />

      <h2 style={S.formTitle}>Nueva contraseña</h2>

      {error && <div style={S.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit} style={S.form}>

        {/* Nueva contraseña */}
        <div>
          <label className="label">Nueva contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              className="input"
              type={showP1 ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={form.newPassword}
              onChange={handleChange('newPassword')}
              required
              minLength={6}
              autoFocus
              style={{ paddingRight: '2.75rem' }}
            />
            <button type="button" onClick={() => setShowP1(p => !p)} style={S.eyeBtn}>
              {showP1 ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label className="label">Confirmar contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              className="input"
              type={showP2 ? 'text' : 'password'}
              placeholder="Repite la contraseña"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              style={{
                paddingRight: '2.75rem',
                borderColor: passwordsMismatch
                  ? '#ef4444'
                  : passwordsMatch
                  ? '#22c55e'
                  : undefined,
              }}
            />
            <button type="button" onClick={() => setShowP2(p => !p)} style={S.eyeBtn}>
              {showP2 ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Indicador coincidencia — sin condicional que desmonte */}
          <div style={{ minHeight: '20px', marginTop: '0.35rem' }}>
            {passwordsMatch && (
              <p style={{ ...S.matchText, color: '#16a34a' }}>
                <CheckCircle size={12} /> Las contraseñas coinciden
              </p>
            )}
            {passwordsMismatch && (
              <p style={{ ...S.matchText, color: '#ef4444' }}>
                <XCircle size={12} /> Las contraseñas no coinciden
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full btn-lg"
          disabled={loading}
          style={{ marginTop: '0.25rem' }}
        >
          {loading
            ? <><Spinner size={18} color="white" />Guardando...</>
            : <><Lock size={16} />Establecer nueva contraseña</>
          }
        </button>
      </form>

      <div style={S.back}>
        <Link to="/login" style={S.backLink}>
          <ArrowLeft size={14} /> Volver al login
        </Link>
      </div>
    </PageWrapper>
  );
}

const S = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: '-10%', left: '50%',
    transform: 'translateX(-50%)',
    width: '500px', height: '500px', borderRadius: '50%',
    pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)',
  },
  card: { padding: '2rem', animation: 'slideUp 0.4s ease' },
  header: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '0.4rem', paddingBottom: '1.25rem', textAlign: 'center',
  },
  iconWrap: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '52px', height: '52px', borderRadius: '0.875rem',
    background: '#eef2ff', marginBottom: '0.25rem',
  },
  brand: {
    margin: 0, fontSize: '1.75rem', fontWeight: '800',
    color: '#0f172a', letterSpacing: '-0.5px',
  },
  subtitle: { margin: 0, fontSize: '0.82rem', color: '#94a3b8' },
  divider: { height: '1px', background: '#f1f5f9', margin: '0 0 1.25rem' },
  formTitle: {
    margin: '0 0 1.25rem', fontSize: '1rem',
    fontWeight: '600', color: '#374151',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '0.75rem 1rem', borderRadius: '0.625rem',
    fontSize: '0.85rem', marginBottom: '0.5rem',
  },
  eyeBtn: {
    position: 'absolute', right: '0.75rem', top: '50%',
    transform: 'translateY(-50%)',
    background: 'none', border: 'none',
    cursor: 'pointer', color: '#94a3b8', padding: 0,
  },
  matchText: {
    margin: 0, fontSize: '0.78rem',
    display: 'flex', alignItems: 'center', gap: '0.3rem',
  },
  center: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', textAlign: 'center', padding: '1rem 0',
  },
  loadingText: { color: '#64748b', fontSize: '0.9rem', marginTop: '1rem' },
  stateTitle: {
    margin: '1rem 0 0.5rem', fontSize: '1.15rem',
    fontWeight: '700', color: '#0f172a',
  },
  stateDesc: {
    margin: 0, fontSize: '0.875rem',
    color: '#64748b', lineHeight: 1.6,
  },
  back: { textAlign: 'center', marginTop: '1.5rem' },
  backLink: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    fontSize: '0.85rem', color: '#64748b',
    textDecoration: 'none', fontWeight: '500',
  },
};