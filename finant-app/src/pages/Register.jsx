import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Shield, X } from 'lucide-react';
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
  const [form, setForm]             = useState({ name: '', document: '', phone: '', email: '', password: '' });
  const [show, setShow]             = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [accepted, setAccepted]     = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const { login }                   = useAuth();
  const navigate                    = useNavigate();

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

            {/* Política de privacidad */}
            <div style={S.policyRow}>
              <label style={S.checkLabel}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  style={S.checkbox}
                />
                <span style={S.checkText}>
                  He leído y acepto la{' '}
                  <button
                    type="button"
                    onClick={() => setShowPolicy(true)}
                    style={S.policyLink}
                  >
                    Política de Privacidad y Manejo de Datos
                  </button>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg"
              disabled={loading || !accepted} style={{ marginTop: '0.25rem' }}>
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

      {/* Modal de Política de Privacidad */}
      {showPolicy && (
        <div style={S.overlay} onClick={() => setShowPolicy(false)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <div style={S.modalTitleRow}>
                <Shield size={22} color="#4f46e5" />
                <h3 style={S.modalTitle}>Política de Privacidad y Manejo de Datos</h3>
              </div>
              <button onClick={() => setShowPolicy(false)} style={S.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={S.modalBody}>
              <div style={S.policySection}>
                <h4 style={S.sectionTitle}>1. Recopilación de Datos</h4>
                <p style={S.sectionText}>
                  Al registrarte en <strong>FinAnt</strong>, recopilamos los datos que proporcionas
                  en el formulario de registro: nombre completo, documento de identidad, teléfono
                  (opcional), correo electrónico y contraseña. Además, se almacenan los datos
                  financieros que registres dentro de la plataforma (cuentas, transacciones y notas).
                </p>
              </div>

              <div style={S.policySection}>
                <h4 style={S.sectionTitle}>2. Acceso del Administrador</h4>
                <p style={S.sectionText}>
                  El administrador de la plataforma <strong>tiene acceso</strong> a los datos
                  registrados por los usuarios en la base de datos del sistema. Esto incluye la
                  información personal proporcionada durante el registro y los datos financieros
                  ingresados en la aplicación.
                </p>
              </div>

              <div style={S.warningBox}>
                <strong>⚠️ Advertencia importante:</strong> Dado que el administrador puede
                acceder a la información almacenada, te recomendamos enfáticamente
                <strong> NO ingresar datos personales reales ni información financiera sensible</strong> como
                números de cuentas bancarias reales, contraseñas de servicios externos,
                información tributaria o cualquier dato cuya exposición pueda representar un riesgo.
              </div>

              <div style={S.policySection}>
                <h4 style={S.sectionTitle}>3. Uso de los Datos</h4>
                <p style={S.sectionText}>
                  Los datos recopilados se utilizan exclusivamente para el funcionamiento de la
                  plataforma FinAnt: autenticación de usuarios, gestión de cuentas financieras
                  personales y generación de reportes internos. No se comparten con terceros.
                </p>
              </div>

              <div style={S.policySection}>
                <h4 style={S.sectionTitle}>4. Responsabilidad del Usuario</h4>
                <p style={S.sectionText}>
                  Al aceptar esta política, reconoces que eres responsable de la información
                  que ingresas en la plataforma. FinAnt no se hace responsable por el uso de
                  datos sensibles que el usuario decida ingresar voluntariamente a pesar de
                  esta advertencia.
                </p>
              </div>

              <div style={S.policySection}>
                <h4 style={S.sectionTitle}>5. Aceptación Obligatoria</h4>
                <p style={S.sectionText}>
                  La aceptación de esta política es <strong>requisito obligatorio</strong> para
                  crear una cuenta en FinAnt. Si no estás de acuerdo con los términos descritos,
                  no podrás completar el proceso de registro.
                </p>
              </div>
            </div>

            <div style={S.modalFooter}>
              <button
                className="btn btn-primary"
                onClick={() => { setAccepted(true); setShowPolicy(false); }}
              >
                <Shield size={16} /> Aceptar Política
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowPolicy(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
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

  /* Política de privacidad - Checkbox */
  policyRow: {
    marginTop: '0.25rem',
  },
  checkLabel: {
    display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer',
  },
  checkbox: {
    marginTop: '0.2rem', accentColor: '#4f46e5', width: '16px', height: '16px',
    cursor: 'pointer', flexShrink: 0,
  },
  checkText: {
    fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4',
  },
  policyLink: {
    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
    color: '#4f46e5', fontWeight: '600', textDecoration: 'underline',
    fontSize: 'inherit', fontFamily: 'inherit',
  },

  /* Modal */
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000, padding: '1rem',
    animation: 'fadeIn 0.2s ease',
  },
  modal: {
    background: 'white', borderRadius: '1rem', maxWidth: '560px',
    width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0',
  },
  modalTitleRow: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
  },
  modalTitle: {
    margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#0f172a',
  },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#94a3b8', padding: '0.25rem', borderRadius: '0.375rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
  },
  modalBody: {
    padding: '1.5rem', overflowY: 'auto', flex: 1,
  },
  policySection: {
    marginBottom: '1.25rem',
  },
  sectionTitle: {
    margin: '0 0 0.375rem', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b',
  },
  sectionText: {
    margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: '1.6',
  },
  warningBox: {
    background: 'linear-gradient(135deg, #fef3c7, #fffbeb)', border: '1px solid #f59e0b',
    borderRadius: '0.625rem', padding: '1rem 1.25rem', marginBottom: '1.25rem',
    fontSize: '0.84rem', color: '#92400e', lineHeight: '1.6',
  },
  modalFooter: {
    display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
    padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0',
  },
};