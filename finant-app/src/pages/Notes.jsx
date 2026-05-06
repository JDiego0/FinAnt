import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notes')
      .then(({ data }) => setNotes(data))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/notes', form);
    setNotes([data, ...notes]);
    setForm({ title: '', content: '' });
  };

  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`);
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Mis notas</h2>

        <form onSubmit={handleCreate} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Título"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            style={styles.textarea}
            placeholder="Contenido..."
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            rows={3}
          />
          <button style={styles.button} type="submit">Agregar nota</button>
        </form>

        {loading ? <p>Cargando...</p> : (
          <div style={styles.grid}>
            {notes.map(note => (
              <div key={note.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <strong>{note.title}</strong>
                  <button onClick={() => handleDelete(note.id)} style={styles.deleteBtn}>✕</button>
                </div>
                <p style={styles.content}>{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  heading: { fontSize: '1.4rem', marginBottom: '1.5rem', color: '#1a1a2e' },
  form: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  textarea: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', resize: 'vertical' },
  button: { alignSelf: 'flex-start', padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' },
  card: { background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  deleteBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' },
  content: { color: '#555', fontSize: '0.9rem', margin: 0 },
};