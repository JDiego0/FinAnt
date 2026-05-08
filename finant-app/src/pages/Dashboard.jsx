import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Edit3, X, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import SkeletonCard from '../components/ui/SkeletonCard';
import api from '../api/axiosConfig';
import { formatCOP } from '../utils/formatCurrency';
import { toast, confirm } from '../utils/alerts';

const ICONS = { Efectivo: '💵', Ahorros: '🏦', Inversiones: '📈' };
const COLORS = { Efectivo: '#10b981', Ahorros: '#3b82f6', Inversiones: '#8b5cf6' };

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/accounts').then(({ data }) => setAccounts(data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const total = accounts.reduce((s, a) => s + Number(a.balance), 0);

  const openAdjust = (acc) => { setAdjusting(acc); setNewBalance(String(acc.balance)); };
  const closeAdjust = () => { setAdjusting(null); setNewBalance(''); };

  const handleAdjust = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/accounts/${adjusting.id}/balance`, { newBalance: Number(newBalance) });
      await load();
      toast('success', 'Saldo actualizado');
      closeAdjust();
    } catch { toast('error', 'Error al ajustar el saldo'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem', animation: 'fadeIn 0.4s ease' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
            Resumen financiero
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Visualiza y gestiona tus cuentas
          </p>
        </div>

        {/* Total card */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          borderRadius: '1.25rem', padding: '1.75rem 2rem',
          marginBottom: '1.5rem', color: 'white',
          boxShadow: '0 8px 32px rgba(79,70,229,0.25)',
          animation: 'slideUp 0.4s ease',
        }}>
          <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>Patrimonio total</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '2.25rem', fontWeight: '700', letterSpacing: '-1px' }}>
            {formatCOP(total)}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', opacity: 0.7, fontSize: '0.8rem' }}>
            <TrendingUp size={14} style={{ marginTop: '1px' }} />
            <span>{accounts.length} cuentas activas</span>
          </div>
        </div>

        {/* Account cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {loading ? (
            [1,2,3].map(i => <SkeletonCard key={i} />)
          ) : accounts.map((acc, i) => (
            <div key={acc.id} className="card" style={{
              padding: '1.5rem', animation: `slideUp ${0.3 + i * 0.1}s ease`,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '0.75rem',
                    background: `${COLORS[acc.type]}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem',
                  }}>
                    {ICONS[acc.type]}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600', color: '#0f172a' }}>{acc.type}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Cuenta activa</p>
                  </div>
                </div>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: COLORS[acc.type],
                }} />
              </div>

              <div style={{ margin: '1.25rem 0 1rem' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Saldo disponible</p>
                <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>
                  {formatCOP(acc.balance)}
                </p>
              </div>

              <button onClick={() => openAdjust(acc)} className="btn btn-secondary btn-full btn-sm"
                style={{ gap: '0.4rem' }}>
                <Edit3 size={13} /> Ajustar saldo
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Modal ajuste de saldo */}
      {adjusting && (
        <div style={overlay} onClick={closeAdjust}>
          <div className="card" style={modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: '600', color: '#0f172a' }}>
                  Ajustar saldo — {adjusting.type}
                </h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Actual: {formatCOP(adjusting.balance)}
                </p>
              </div>
              <button onClick={closeAdjust} className="btn btn-ghost btn-sm" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjust}>
              <label className="label">Nuevo saldo</label>
              <input className="input" type="number" value={newBalance}
                onChange={e => setNewBalance(e.target.value)}
                min="0" step="1" required autoFocus
                style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }} />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={closeAdjust} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Guardando...' : <><Check size={16} /> Confirmar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
  backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 100, padding: '1rem',
  animation: 'fadeIn 0.2s ease',
};
const modal = {
  width: '100%', maxWidth: '400px', padding: '1.75rem',
  animation: 'slideUp 0.3s ease',
};