import { useEffect, useState } from 'react';
import { Plus, Trash2, Check, TrendingUp, TrendingDown, ArrowLeftRight, X, Pencil } from 'lucide-react';
import Navbar from '../components/Navbar';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import api from '../api/axiosConfig';
import { formatCOP } from '../utils/formatCurrency';
import { toast, confirm, alert } from '../utils/alerts';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [editingId, setEditingId]       = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [toggling, setToggling]         = useState(null);
  const [form, setForm] = useState({
    accountId:   '',
    type:        'income',
    date:        new Date().toISOString().split('T')[0],
    description: '',
    amount:      '',
    applied:     false,
    destinationAccountId: '',
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
    reload()
      .catch(() => toast('error', 'Error al cargar los movimientos'))
      .finally(() => setLoading(false));
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────
  const getAccount = (id) => accounts.find(a => a.id === id);

  const resetForm = () => setForm({
    accountId:   '',
    type:        'income',
    date:        new Date().toISOString().split('T')[0],
    description: '',
    amount:      '',
    applied:     false,
    destinationAccountId: '',
  });

  // ── Crear / Editar movimiento ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        accountId: Number(form.accountId),
        amount:    Number(form.amount),
      };
      if (form.type === 'transfer') {
        payload.destinationAccountId = Number(form.destinationAccountId);
        payload.applied = true;
        payload.description = 'Traslado entre cuentas';
      }
      if (editingId) {
        await api.put(`/transactions/${editingId}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      await reload();
      setShowForm(false);
      setEditingId(null);
      resetForm();
      toast('success', editingId ? 'Movimiento actualizado' : 'Movimiento registrado');
    } catch (err) {
      const res = err.response;
      if (res?.status === 409 && res.data?.accountType) {
        const d = res.data;
        alert(
          'warning',
          'Saldo insuficiente',
          `La cuenta "${d.accountType}" no tiene saldo suficiente.\n\nSaldo actual: ${formatCOP(d.currentBalance)}\nMonto requerido: ${formatCOP(d.requiredAmount)}`
        );
      } else {
        toast('error', editingId ? 'Error al actualizar' : 'Error al registrar movimiento');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Abrir edición ────────────────────────────────────────────────────
  const handleEdit = (t) => {
    setForm({
      accountId:            String(t.accountId),
      type:                 t.type,
      date:                 t.date,
      description:          t.description || '',
      amount:               String(t.amount),
      applied:              t.applied,
      destinationAccountId: t.destinationAccountId ? String(t.destinationAccountId) : '',
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  // ── Toggle aplicado (optimista) ──────────────────────────────────
  const handleToggle = async (id) => {
    setToggling(id);
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, applied: !t.applied } : t)
    );
    try {
      await api.patch(`/transactions/${id}/toggle`);
      api.get('/accounts').then(({ data }) => setAccounts(data));
      toast('success', 'Estado actualizado');
    } catch (err) {
      setTransactions(prev =>
        prev.map(t => t.id === id ? { ...t, applied: !t.applied } : t)
      );
      const res = err.response;
      if (res?.status === 409 && res.data?.accountType) {
        const d = res.data;
        alert(
          'warning',
          'Saldo insuficiente',
          `La cuenta "${d.accountType}" no tiene saldo suficiente para aplicar este movimiento.\n\nSaldo actual: ${formatCOP(d.currentBalance)}\nMonto requerido: ${formatCOP(d.requiredAmount)}`
        );
      } else {
        toast('error', 'Error al actualizar');
      }
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
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '1.5rem',
        }}>
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

        {/* ── Modal: nuevo movimiento ─────────────────────────────── */}
        {showForm && (
          <div style={S.overlay} onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}>
            <div
              className="card"
              style={S.modal}
              onClick={e => e.stopPropagation()}
            >
              <div style={S.modalHeader}>
                <h3 style={{ margin: 0, fontWeight: '600', color: '#0f172a' }}>
                  {editingId ? 'Editar movimiento' : 'Nuevo movimiento'}
                </h3>
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '0.25rem' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
              >
                {/* Cuenta + Tipo */}
                <div style={S.grid2}>
                  <div>
                    <label className="label">Cuenta</label>
                    <select
                      className="input"
                      value={form.accountId}
                      onChange={e => setForm({ ...form, accountId: e.target.value })}
                      required
                      disabled={!!editingId}
                      style={editingId ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                    >
                      <option value="">Seleccionar</option>
                      {accounts.map(a => (
                        <option key={a.id} value={a.id}>{a.type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Tipo</label>
                    <select
                      className="input"
                      value={form.type}
                      onChange={e => {
                        const newType = e.target.value;
                        setForm(prev => ({
                          ...prev,
                          type: newType,
                          description: newType === 'transfer' ? 'Traslado entre cuentas' : (prev.type === 'transfer' ? '' : prev.description),
                          destinationAccountId: newType === 'transfer' ? prev.destinationAccountId : '',
                          applied: newType === 'transfer' ? true : prev.applied,
                        }));
                      }}
                      disabled={!!editingId}
                      style={editingId ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                    >
                      <option value="income">💚 Ingreso</option>
                      <option value="expense">🔴 Egreso</option>
                      <option value="transfer">🔄 Traslado</option>
                    </select>
                  </div>
                </div>

                {/* Fecha + Valor */}
                <div style={S.grid2}>
                  <div>
                    <label className="label">Fecha</label>
                    <input
                      className="input"
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Valor (COP)</label>
                    <input
                      className="input"
                      type="number"
                      placeholder="0"
                      value={form.amount}
                      onChange={e => setForm({ ...form, amount: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                </div>

                {/* Cuenta destino (solo traslado) */}
                {form.type === 'transfer' && (
                  <div>
                    <label className="label">Cuenta destino</label>
                    <select
                      className="input"
                      value={form.destinationAccountId}
                      onChange={e => setForm({ ...form, destinationAccountId: e.target.value })}
                      required
                    >
                      <option value="">Seleccionar destino</option>
                      {accounts
                        .filter(a => String(a.id) !== String(form.accountId))
                        .map(a => (
                          <option key={a.id} value={a.id}>{a.type}</option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Descripción */}
                <div>
                  <label className="label">Descripción</label>
                  <input
                    className="input"
                    placeholder="Ej: Pago de nómina"
                    value={form.type === 'transfer' ? 'Traslado entre cuentas' : form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    disabled={form.type === 'transfer'}
                    style={form.type === 'transfer' ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                  />
                </div>

                {/* Checkbox aplicar (oculto en traslados) */}
                {form.type !== 'transfer' && (
                  <label style={S.checkLabel}>
                    <input
                      type="checkbox"
                      checked={form.applied}
                      onChange={e => setForm({ ...form, applied: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#4f46e5', cursor: 'pointer' }}
                    />
                    Aplicar al saldo inmediatamente
                  </label>
                )}

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={submitting}
                  >
                    {submitting
                      ? <><Spinner size={16} color="white" />Guardando...</>
                      : editingId ? 'Guardar cambios' : 'Registrar movimiento'
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Lista de transacciones ──────────────────────────────── */}
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
              const acc        = getAccount(t.accountId);
              const isIncome   = t.type === 'income';
              const isTransfer = t.type === 'transfer';
              const isBusy     = toggling === t.id;
              const borderColor = isTransfer ? '#7c3aed' : isIncome ? '#22c55e' : '#ef4444';

              return (
                <div
                  key={t.id}
                  className="card"
                  style={{
                    padding: '0.875rem 1rem',
                    animation: `slideUp ${0.1 + i * 0.03}s ease`,
                    opacity: t.applied ? 1 : 0.65,
                    borderLeft: `3px solid ${borderColor}`,
                    transition: 'box-shadow 0.2s, opacity 0.3s',
                  }}
                >
                  {/* ── Fila 1: ícono + info + monto ── */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

                    {/* Ícono tipo */}
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '0.5rem',
                      flexShrink: 0,
                      background: isTransfer ? '#f3e8ff' : isIncome ? '#dcfce7' : '#fef2f2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isTransfer
                        ? <ArrowLeftRight size={15} color="#7c3aed" />
                        : isIncome
                        ? <TrendingUp   size={15} color="#16a34a" />
                        : <TrendingDown size={15} color="#dc2626" />
                      }
                    </div>

                    {/* Descripción + meta */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        margin: 0, fontWeight: '500', color: '#0f172a',
                        fontSize: '0.875rem',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {t.description || 'Sin descripción'}
                      </p>
                      <p style={{
                        margin: '0.15rem 0 0', fontSize: '0.72rem', color: '#94a3b8',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {acc?.type ?? '—'}{isTransfer && t.destinationAccountId ? ` → ${getAccount(t.destinationAccountId)?.type ?? '—'}` : ''} · {t.date}
                        {!t.applied && (
                          <span style={{
                            marginLeft: '0.4rem', color: '#f59e0b', fontWeight: '600',
                          }}>
                            · Pendiente
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Monto */}
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <p style={{
                        margin: 0, fontWeight: '700', fontSize: '0.875rem',
                        color: isTransfer ? '#7c3aed' : isIncome ? '#16a34a' : '#dc2626',
                        whiteSpace: 'nowrap',
                      }}>
                        {isTransfer ? '⇄ ' : isIncome ? '+' : '−'}{formatCOP(t.amount)}
                      </p>
                    </div>
                  </div>

                  {/* ── Fila 2: acciones ── */}
                  <div style={{
                    display: 'flex', justifyContent: 'flex-end',
                    gap: '0.375rem', marginTop: '0.625rem',
                  }}>

                    {/* Toggle (oculto en traslados) */}
                    {!isTransfer && (
                      <button
                        onClick={() => handleToggle(t.id)}
                        disabled={isBusy}
                        className="btn btn-sm"
                        title={t.applied ? 'Desmarcar' : 'Marcar como hecho'}
                        style={{
                          background: t.applied ? '#dcfce7' : '#f1f5f9',
                          color:      t.applied ? '#16a34a' : '#94a3b8',
                          padding: '0.3rem 0.625rem', fontSize: '0.75rem',
                          gap: '0.3rem', display: 'flex', alignItems: 'center',
                          transition: 'background 0.2s, color 0.2s',
                        }}
                      >
                        {isBusy
                          ? <Spinner size={12} color={t.applied ? '#16a34a' : '#94a3b8'} />
                          : <Check size={13} />
                        }
                        <span>{t.applied ? 'Hecho' : 'Pendiente'}</span>
                      </button>
                    )}

                    {/* Editar */}
                    <button
                      onClick={() => handleEdit(t)}
                      disabled={isBusy}
                      className="btn btn-sm"
                      title="Editar"
                      style={{
                        background: '#eef2ff',
                        color: '#4f46e5',
                        padding: '0.3rem 0.625rem', fontSize: '0.75rem',
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                      }}
                    >
                      <Pencil size={13} />
                      <span>Editar</span>
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={isBusy}
                      className="btn btn-danger btn-sm"
                      title="Eliminar"
                      style={{
                        padding: '0.3rem 0.625rem', fontSize: '0.75rem',
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Eliminar</span>
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