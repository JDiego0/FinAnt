import { useEffect, useState } from 'react';
import { Plus, Trash2, StickyNote, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import api from '../api/axiosConfig';
import { toast, confirm } from '../utils/alerts';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get('/notes').then(({ data }) => setNotes(data));
  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/notes', form);
      await load();
      setForm({ title: '', content: '' });
      setShowForm(false);
      toast('success', 'Nota creada');
    } catch { toast('error', 'Error al crear nota'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    const r = await confirm('¿Eliminar nota?', 'Esta acción no se puede deshacer.');
    if (!r.isConfirmed) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n.id !== id));
      toast('success', 'Nota eliminada');
    } catch { toast('error', 'Error al eliminar'); }
  };

  const colors = ['#fef9c3', '#dbeafe', '#dcfce7', '#fce7f3', '#ede9fe', '#ffedd5'];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Notas</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {notes.length} nota{notes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus size={16} /> Nueva nota
          </button>
        </div>

        {showForm && (
          <div style={overlay} onClick={() => setShowForm(false)}>
            <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '1.75rem', animation: 'slideUp 0.3s ease' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontWeight: '600' }}>Nueva nota</h3>
                <button onClick={() => setShowForm(false)} className="btn btn-ghost btn-sm"><X size={18} /></button>
              </div>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div>
                  <label className="label">Título</label>
                  <input className="input" placeholder="Título de la nota" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Contenido</label>
                  <textarea className="input" placeholder="Escribe aquí..." value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    rows={4} style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                    {submitting ? <><Spinner size={16} color="white" /> Guardando...</> : 'Crear nota'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner size={32} />
          </div>
        ) : notes.length === 0 ? (
          <div className="card">
            <EmptyState icon="📝" title="Sin notas" description="Crea tu primera nota para recordar algo importante" />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {notes.map((note, i) => (
              <div key={note.id} style={{
                background: colors[i % colors.length],
                borderRadius: '1rem', padding: '1.25rem',
                border: '1px solid rgba(0,0,0,0.06)',
                animation: `slideUp ${0.1 + i * 0.05}s ease`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StickyNote size={14} color="#475569" />
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' }}>{note.title}</p>
                  </div>
                  <button onClick={() => handleDelete(note.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.2rem', color: '#94a3b8', opacity: 0.7 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {note.content || <span style={{ opacity: 0.5 }}>Sin contenido</span>}
                </p>
                <p style={{ margin: '0.75rem 0 0', fontSize: '0.7rem', color: '#94a3b8' }}>
                  {new Date(note.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
  backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 100, padding: '1rem',
};