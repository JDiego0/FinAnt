export default function EmptyState({ icon, title, description }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.7 }}>{icon}</div>
      <p style={{ fontWeight: '600', color: '#475569', margin: '0 0 0.4rem', fontSize: '1rem' }}>{title}</p>
      <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>{description}</p>
    </div>
  );
}