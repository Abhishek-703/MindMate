import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast, ToastMessage } from '../contexts/ToastContext';

const Toast: React.FC<{ toast: ToastMessage; onHide: (id: string) => void }> = ({ toast, onHide }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        onHide(toast.id);
      }, 500); // Wait for exit animation to complete
      return () => clearTimeout(exitTimer);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast, onHide]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onHide(toast.id), 500);
  };
  
  const iconMap: Record<NonNullable<ToastMessage['type']>, React.ReactNode> = {
    success: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    error: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    info: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
  };

  return (
    <div
      className={`relative w-full max-w-sm p-4 my-2 rounded-xl glass-card flex items-start gap-4 shadow-2xl ${
        isExiting ? 'animate-slideOutToTop' : 'animate-slideInFromTop'
      }`}
    >
      <div className="flex-shrink-0">{iconMap[toast.type || 'info']}</div>
      <div className="flex-grow text-sm text-[var(--text-primary)]">{toast.message}</div>
      <button onClick={handleClose} className="flex-shrink-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();
  const portalRoot = document.getElementById('toast-root');

  if (!portalRoot) {
    console.error('Toast root element not found!');
    return null;
  }
  
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-50 pointer-events-auto">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onHide={hideToast} />
      ))}
    </div>,
    portalRoot
  );
};

export default ToastContainer;