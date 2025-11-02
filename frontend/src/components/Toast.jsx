import { useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: '#d4edda', border: '#28a745', text: '#155724' },
    error: { bg: '#f8d7da', border: '#dc3545', text: '#721c24' },
    info: { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460' }
  };

  const theme = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      minWidth: '300px',
      maxWidth: '500px',
      padding: '1rem 1.5rem',
      background: theme.bg,
      border: `1px solid ${theme.border}`,
      borderLeft: `4px solid ${theme.border}`,
      borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      color: theme.text,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      animation: 'slideIn 0.3s ease-out',
      zIndex: 9999
    }}>
      <span style={{ fontWeight: '500' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: theme.text,
          fontSize: '1.2rem',
          cursor: 'pointer',
          marginLeft: '1rem',
          padding: '0',
          opacity: 0.7
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Toast;