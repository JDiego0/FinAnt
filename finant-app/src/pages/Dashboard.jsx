import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/accounts')
      .then(({ data }) => setAccounts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  const fmt = (val) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0
  }).format(val);

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
                </div>
              ))}
            </div>

            <div style={styles.total}>
              <span>Patrimonio total</span>
              <span style={styles.totalAmount}>{fmt(total)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  heading: { fontSize: '1.4rem', marginBottom: '1.5rem', color: '#1a1a2e' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' },
  cardIcon: { fontSize: '2rem', marginBottom: '0.5rem' },
  cardType: { color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' },
  cardBalance: { fontSize: '1.4rem', fontWeight: '700', color: '#1a1a2e' },
  total: { marginTop: '1.5rem', background: '#4f46e5', color: 'white', borderRadius: '12px', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem' },
  totalAmount: { fontSize: '1.5rem', fontWeight: '700' },
};