import { useEffect, useState } from 'react';
import { Plus, Trash2, Check, TrendingUp, TrendingDown, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import api from '../api/axiosConfig';
import { formatCOP } from '../utils/formatCurrency';
import { toast, confirm } from '../utils/alerts';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [toggling, setToggling]         = useState(null);
  const [form, setForm] = useState({
    accountId:   '',
    type:        'income',
    date:        new Date().toISOString().split('T')[0],
    description: '',
    amount:      '',
    applied:     false,
  });

  // ── Carga inicial ────────────────────────────────────────────────
  const reload = async () => {
    const [t, a] = await Promise.all([
      api.get('/transactions'),
      api.get('/accounts'),
    ]);
    setTransactions(t.data);
    setAccounts(a.data);
  };

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────
  const getAccount  = (id) => accounts.find(a => a.id === id);
  const resetForm   = ()   => setForm({
    accountId: '', type: 'income',
    date: new Date().toISOString().split('T')[0],
    description: '', amount: '', applied: false,
  });

  // ── Crear movimiento ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/transactions', {
        ...form,
        accountId: Number(form.accountId),
        amount:    Number(form.amount),
      });
      await reload();
      setShowForm(false);
      resetForm();
      toast('success', 'Movimiento registrado');
    } catch {
      toast('error', 'Error al registrar movimiento');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle aplicado (optimista) ──────────────────────────────────
  const handleToggle = async (id) => {
    setToggling(id);
    // Actualización optimista inmediata
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, applied: !t.applied } : t)
    );
    try {
      await api.patch(`/transactions/${id}/toggle`);
      // Refrescar saldos en background sin bloquear la UI
      api.get('/accounts').then(({ data }) => setAccounts(data));
      toast('success', 'Estado actualizado');
    } catch {
      // Revertir si falló
      setTransactions(prev =>
        prev.map(t => t.id === id ? { ...t, applied: !t.applied } : t)
      );
      toast('error', 'Error al actualizar');
    } finally {
      setToggling(null);
    }
  };

  // ── Eliminar ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const r = await confirm(
      '¿Eliminar movimiento?',
      'Esta acción no se puede deshacer. El saldo actual se conservará.'
    );
    if (!r.isConfirmed) return;
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t.id !== id));
      api.get('/accounts').then(({ data }) => setAccounts(data));
      toast('success', 'Movimiento eliminado');
    } catch {
      toast('error', 'Error al eliminar');
    }
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Movimientos
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {transactions.length} registro{transactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus size={16} /> Nuevo
          </button>
        </div>

        {/* ── Modal: nuevo movimiento ── */}
        {showForm && (
          <div style={S.overlay} onClick={() => { setShowForm(false); resetForm(); }}>
            <div className="card" style={S.modal} onClick={e => e.stopPropagation()}>

              <div style={S.modalHeader}>
                <h3 style={{ margin: 0, fontWeight: '600', color: '#0f172a' }}>
                  Nuevo movimiento
                </h3>
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '0.25rem' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

                {/* Cuenta + Tipo */}
                <div style={S.grid2}>
                  <div>
                    <label className="label">Cuenta</label>
                    <select className="input" value={form.accountId}
                      onChange={e => setForm({ ...form, accountId: e.target.value })} required>
                      <option value="">Seleccionar</option>
                      {accounts.map(a => (
                        <option key={a.id} value={a.id}>{a.type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Tipo</label>
                    <select className="input" value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option value="income">💚 Ingreso</option>
                      <option value="expense">🔴 Egreso</option>
                    </select>
                  </div>
                </div>

                {/* Fecha + Valor */}
                <div style={S.grid2}>
                  <div>
                    <label className="label">Fecha</label>
                    <input className="input" type="date" value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label">Valor (COP)</label>
                    <input className="input" type="number" placeholder="0"
                      value={form.amount}
                      onChange={e => setForm({ ...form, amount: e.target.value })}
                      required min="1" />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="label">Descripción</label>
                  <input className="input" placeholder="Ej: Pago de nómina"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>

                {/* Checkbox aplicar */}
                <label style={S.checkLabel}>
                  <input
                    type="checkbox"
                    checked={form.applied}
                    onChange={e => setForm({ ...form, applied: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#4f46e5', cursor: 'pointer' }}
                  />
                  Aplicar al saldo inmediatamente
                </label>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <button type="button"
                    onClick={() => { setShowForm(false); resetForm(); }}
                    className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary"
                    style={{ flex: 1 }} disabled={submitting}>
                    {submitting
                      ? <><Spinner size={16} color="white" />Guardando...</>
                      : 'Registrar movimiento'
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Lista de transacciones ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Spinner size={36} />
          </div>
        ) : transactions.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="💸"
              title="Sin movimientos"
              description="Registra tu primer ingreso o egreso usando el botón Nuevo"
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {transactions.map((t, i) => {
              const acc      = getAccount(t.accountId);
              const isIncome = t.type === 'income';
              const isBusy   = toggling === t.id;

              return (
                <div
                  key={t.id}
                  className="card"
                  style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    animation: `slideUp ${0.1 + i * 0.03}s ease`,
                    opacity: t.applied ? 1 : 0.6,
                    borderLeft: `3px solid ${isIncome ? '#22c55e' : '#ef4444'}`,
                    transition: 'box-shadow 0.2s, opacity 0.3s',
                  }}
                >
                  {/* Ícono tipo */}
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '0.625rem', flexShrink: 0,
                    background: isIncome ? '#dcfce7' : '#fef2f2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isIncome
                      ? <TrendingUp  size={16} color="#16a34a" />
                      : <TrendingDown size={16} color="#dc2626" />
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontWeight: '500', color: '#0f172a', fontSize: '0.9rem',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {t.description || 'Sin descripción'}
                    </p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                      {acc?.type ?? '—'} · {t.date}
                      {!t.applied && (
                        <span style={{ marginLeft: '0.5rem', color: '#f59e0b', fontWeight: '600' }}>
                          · Pendiente
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Monto */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{
                      margin: 0, fontWeight: '700', fontSize: '0.95rem',
                      color: isIncome ? '#16a34a' : '#dc2626',
                    }}>
                      {isIncome ? '+' : '−'}{formatCOP(t.amount)}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>

                    {/* Toggle aplicado */}
                    <button
                      onClick={() => handleToggle(t.id)}
                      disabled={isBusy}
                      className="btn btn-sm"
                      title={t.applied ? 'Desmarcar' : 'Marcar como hecho'}
                      style={{
                        background: t.applied ? '#dcfce7' : '#f1f5f9',
                        color:      t.applied ? '#16a34a' : '#94a3b8',
                        padding: '0.375rem 0.5rem',
                        minWidth: '34px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s, color 0.2s',
                      }}
                    >
                      {isBusy
                        ? <Spinner size={13} color={t.applied ? '#16a34a' : '#94a3b8'} />
                        : <Check size={14} />
                      }
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={isBusy}
                      className="btn btn-danger btn-sm"
                      title="Eliminar movimiento"
                      style={{ padding: '0.375rem 0.5rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Estilos ──────────────────────────────────────────────────────────
const S = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(15,23,42,0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: '1rem',
    animation: 'fadeIn 0.2s ease',
  },
  modal: {
    width: '100%', maxWidth: '500px',
    padding: '1.75rem',
    animation: 'slideUp 0.3s ease',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '1.25rem',
  },
  grid2: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem',
  },
  checkLabel: {
    display: 'flex', alignItems: 'center', gap: '0.625rem',
    cursor: 'pointer', fontSize: '0.875rem', color: '#475569',
    userSelect: 'none',
  },
};