import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

export default function Register() {
  const [form, setForm] = useState({
    name: '', document: '', phone: '', email: '',
    password: '', securityQuestion: '', securityAnswer: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof data === 'object'
        ? Object.values(data).join(', ')
        : 'Error al registrarse';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Nombre completo', type: 'text' },
    { name: 'document', label: 'Documento', type: 'text' },
    { name: 'phone', label: 'Teléfono', type: 'text' },
    { name: 'email', label: 'Correo', type: 'email' },
    { name: 'password', label: 'Contraseña', type: 'password' },
    { name: 'securityQuestion', label: 'Pregunta de seguridad', type: 'text' },
    { name: 'securityAnswer', label: 'Respuesta', type: 'text' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear cuenta</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {fields.map(f => (
            <div key={f.name} style={styles.field}>
              <label style={styles.label}>{f.label}</label>
              <input
                style={styles.input}
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                required={f.name !== 'phone'}
              />
            </div>
          ))}
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p style={styles.link}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', padding: '2rem 0' },
  card: { background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '420px', boxShadow: '0 2px 16px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 1.5rem', fontSize: '1.5rem', color: '#1a1a2e' },
  field: { marginBottom: '0.9rem' },
  label: { display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '0.85rem' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' },
  link: { textAlign: 'center', marginTop: '1rem', color: '#666' },
};