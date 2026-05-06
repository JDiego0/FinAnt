import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>FinAnt</h2>
        <p style={styles.subtitle}>Inicia sesión en tu cuenta</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Correo</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={styles.link}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' },
  card: { background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 16px rgba(0,0,0,0.1)' },
  title: { margin: 0, fontSize: '1.8rem', color: '#1a1a2e' },
  subtitle: { color: '#666', marginBottom: '1.5rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  link: { textAlign: 'center', marginTop: '1rem', color: '#666' },
};