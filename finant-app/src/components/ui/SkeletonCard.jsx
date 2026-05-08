export default function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '0.75rem' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="skeleton" style={{ height: '14px', width: '60%' }} />
          <div className="skeleton" style={{ height: '12px', width: '40%' }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: '32px', width: '80%', marginTop: '0.25rem' }} />
      <div className="skeleton" style={{ height: '36px', width: '100%', borderRadius: '0.625rem' }} />
    </div>
  );
}