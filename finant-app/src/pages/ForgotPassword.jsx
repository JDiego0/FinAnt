import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/axiosConfig';
import Spinner from '../components/ui/Spinner';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Paso 1: verificar si el email existe
      const { data: check } = await api.post('/auth/check-email', { email });

      if (!check.exists) {
        setError('No existe ninguna cuenta asociada a este correo electrónico.');
        setLoading(false);
        return;
      }

      // Paso 2: enviar enlace
      await api.post('/auth/forgot-password', { email });
      setSent(true);

    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.glow} />

      <div style={{ width: '100%', maxWidth: '420px', padding: '1rem' }}>
        <div className="card" style={S.card}>

          {!sent ? (
            <>
              {/* Header */}
              <div style={S.header}>
                <div style={S.iconWrap}>
                  <Mail size={24} color="#4f46e5" />
                </div>
                <h1 style={S.title}>¿Olvidaste tu contraseña?</h1>
                <p style={S.desc}>
                  Ingresa tu correo y te enviaremos un enlace para restablecerla.
                </p>
              </div>

              {error && (
                <div style={S.errorBox}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={S.form}>
                <div>
                  <label className="label">Correo electrónico</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-lg"
                  disabled={loading}
                >
                  {loading
                    ? <><Spinner size={18} color="white" />Verificando...</>
                    : <><Mail size={18} />Enviar enlace de recuperación</>
                  }
                </button>
              </form>
            </>
          ) : (
            /* Estado de éxito */
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ ...S.iconWrap, background: '#dcfce7', margin: '0 auto 1rem' }}>
                <CheckCircle size={24} color="#16a34a" />
              </div>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                ¡Correo enviado!
              </h2>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                Revisa tu bandeja de entrada en <strong>{email}</strong>.
                El enlace expira en 30 minutos.
              </p>
              <p style={{ margin: '0 0 1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                ¿No lo ves? Revisa tu carpeta de spam.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="btn btn-secondary btn-full"
              >
                Intentar con otro correo
              </button>
            </div>
          )}

          <div style={S.back}>
            <Link to="/login" style={S.backLink}>
              <ArrowLeft size={14} /> Volver al login
            </Link>
          </div>
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
  card: { padding: '2rem', animation: 'slideUp 0.4s ease' },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  iconWrap: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '52px', height: '52px', borderRadius: '0.875rem',
    background: '#eef2ff', marginBottom: '1rem',
  },
  title: { margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' },
  desc: { margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '0.75rem 1rem', borderRadius: '0.625rem',
    fontSize: '0.85rem', marginBottom: '1rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  back: { textAlign: 'center', marginTop: '1.5rem' },
  backLink: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    fontSize: '0.85rem', color: '#64748b', textDecoration: 'none',
    fontWeight: '500', transition: 'color 0.2s',
  },
};