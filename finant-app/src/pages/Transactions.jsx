import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    accountId: '', type: 'income', date: '', description: '', amount: '', applied: true
  });

  useEffect(() => {
    api.get('/accounts').then(({ data }) => setAccounts(data));
    api.get('/transactions').then(({ data }) => setTransactions(data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/transactions', {
      ...form,
      accountId: Number(form.accountId),
      amount: Number(form.amount),
    });
    setTransactions([data, ...transactions]);
    setForm({ accountId: '', type: 'income', date: '', description: '', amount: '', applied: true });
    // Refrescar cuentas para ver saldo actualizado
    api.get('/accounts').then(({ data }) => setAccounts(data));
  };

  const handleToggle = async (id) => {
    const { data } = await api.patch(`/transactions/${id}/toggle`);
    setTransactions(transactions.map(t => t.id === id ? data : t));
    api.get('/accounts').then(({ data }) => setAccounts(data));
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions(transactions.filter(t => t.id !== id));
    api.get('/accounts').then(({ data }) => setAccounts(data));
  };

  const fmt = (val) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0
  }).format(val);

  const getAccountType = (id) => accounts.find(a => a.id === id)?.type || '';

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Movimientos</h2>

        <form onSubmit={handleCreate} style={styles.form}>
          <select style={styles.input} value={form.accountId}
            onChange={e => setForm({ ...form, accountId: e.target.value })} required>
            <option value="">Selecciona cuenta</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.type}</option>
            ))}
          </select>

          <select style={styles.input} value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="income">Ingreso</option>
            <option value="expense">Egreso</option>
          </select>

          <input style={styles.input} type="date" value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })} required />

          <input style={styles.input} placeholder="Descripción" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />

          <input style={styles.input} type="number" placeholder="Valor" value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })} required min="0" />

          <label style={styles.checkLabel}>
            <input type="checkbox" checked={form.applied}
              onChange={e => setForm({ ...form, applied: e.target.checked })} />
            {' '}Aplicar al saldo
          </label>

          <button style={styles.button} type="submit">Agregar</button>
        </form>

        <div style={styles.list}>
          {transactions.map(t => (
            <div key={t.id} style={{
              ...styles.item,
              borderLeft: `4px solid ${t.type === 'income' ? '#22c55e' : '#ef4444'}`
            }}>
              <div style={styles.itemInfo}>
                <span style={styles.itemDesc}>{t.description || '—'}</span>
                <span style={styles.itemMeta}>
                  {getAccountType(t.accountId)} · {t.date}
                </span>
              </div>
              <div style={styles.itemRight}>
                <span style={{ color: t.type === 'income' ? '#22c55e' : '#ef4444', fontWeight: '700' }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </span>
                <div style={styles.actions}>
                  <label style={styles.checkLabel}>
                    <input type="checkbox" checked={t.applied}
                      onChange={() => handleToggle(t.id)} />
                    {' '}Hecho
                  </label>
                  <button onClick={() => handleDelete(t.id)} style={styles.deleteBtn}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  heading: { fontSize: '1.4rem', marginBottom: '1.5rem', color: '#1a1a2e' },
  form: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.8rem', alignItems: 'end' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' },
  checkLabel: { fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' },
  button: { padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  item: { background: 'white', borderRadius: '10px', padding: '1rem 1.2rem', boxShadow: '0 2px 6px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  itemDesc: { fontWeight: '500' },
  itemMeta: { fontSize: '0.8rem', color: '#888' },
  itemRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' },
  actions: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  deleteBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' },
};