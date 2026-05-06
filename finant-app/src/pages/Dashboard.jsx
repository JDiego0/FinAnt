import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(null); // cuenta seleccionada para ajustar
  const [newBalance, setNewBalance] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAccounts = () => {
    return api.get('/accounts')
      .then(({ data }) => setAccounts(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAccounts(); }, []);

  const total = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  const fmt = (val) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0
  }).format(val);

  const handleAdjust = async (e) => {
    e.preventDefault();
    if (!adjusting) return;
    setSaving(true);
    try {
      await api.patch(`/accounts/${adjusting.id}/balance`, {
        newBalance: Number(newBalance)
      });
      await fetchAccounts();
      setAdjusting(null);
      setNewBalance('');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al ajustar saldo');
    } finally {
      setSaving(false);
    }
  };

  const icons = { Efectivo: '💵', Ahorros: '🏦', Inversiones: '📈' };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Resumen financiero</h2>

        {loading ? <p>Cargando...</p> : (
          <>
            <div style={styles.grid}>
              {accounts.map(acc => (
                <div key={acc.id} style={styles.card}>
                  <div style={styles.cardIcon}>{icons[acc.type] || '💰'}</div>
                  <div style={styles.cardType}>{acc.type}</div>
                  <div style={styles.cardBalance}>{fmt(acc.balance)}</div>
                  <button
                    style={styles.adjustBtn}
                    onClick={() => {
                      setAdjusting(acc);
                      setNewBalance(acc.balance);
                    }}
                  >
                    Ajustar saldo
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.total}>
              <span>Patrimonio total</span>
              <span style={styles.totalAmount}>{fmt(total)}</span>
            </div>
          </>
        )}

        {/* Modal de ajuste */}
        {adjusting && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <h3 style={styles.modalTitle}>
                Ajustar saldo — {adjusting.type}
              </h3>
              <p style={styles.modalCurrent}>
                Saldo actual: <strong>{fmt(adjusting.balance)}</strong>
              </p>
              <form onSubmit={handleAdjust}>
                <label style={styles.label}>Nuevo saldo</label>
                <input
                  style={styles.input}
                  type="number"
                  value={newBalance}
                  onChange={e => setNewBalance(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                  autoFocus
                />
                <div style={styles.modalActions}>
                  <button
                    type="button"
                    style={styles.cancelBtn}
                    onClick={() => { setAdjusting(null); setNewBalance(''); }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={styles.confirmBtn}
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Confirmar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  heading: { fontSize: '1.4rem', marginBottom: '1.5rem', color: '#1a1a2e' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  cardIcon: { fontSize: '2rem' },
  cardType: { color: '#666', fontSize: '0.9rem' },
  cardBalance: { fontSize: '1.4rem', fontWeight: '700', color: '#1a1a2e' },
  adjustBtn: { marginTop: '0.5rem', padding: '6px 14px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: '#444' },
  total: { marginTop: '1.5rem', background: '#4f46e5', color: 'white', borderRadius: '12px', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalAmount: { fontSize: '1.5rem', fontWeight: '700' },
  // Modal
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: 'white', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '380px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  modalTitle: { margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#1a1a2e' },
  modalCurrent: { color: '#666', fontSize: '0.9rem', marginBottom: '1.2rem' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '1.2rem' },
  modalActions: { display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' },
  cancelBtn: { padding: '8px 18px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  confirmBtn: { padding: '8px 18px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
};