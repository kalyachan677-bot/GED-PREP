"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="th">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #ede9fe 50%, #e0e7ff 100%)',
      }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '400px' }}>
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 1rem',
            borderRadius: '16px', background: '#fef2f2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px',
          }}>!</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
            เกิดข้อผิดพลาด
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
            {error?.message || 'มีข้อผิดพลาดบางอย่างเกิดขึ้น'}
          </p>
          {error?.digest && (
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              padding: '0.625rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(to right, #7c3aed, #4f46e5)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
            }}
          >
            ลองใหม่
          </button>
        </div>
      </body>
    </html>
  );
}
