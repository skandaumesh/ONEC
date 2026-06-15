import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const icons = {
 success: <CheckCircle2 size={18} />,
 error: <XCircle size={18} />,
 warning: <AlertTriangle size={18} />,
 info: <Info size={18} />,
};

const colors = {
 success: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)', text: '#16a34a', icon: '#22c55e' },
 error: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#dc2626', icon: '#ef4444' },
 warning: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#d97706', icon: '#f59e0b' },
 info: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#2563eb', icon: '#3b82f6' },
};

function ToastItem({ toast, onRemove }) {
 const [progress, setProgress] = useState(100);
 const c = colors[toast.type] || colors.info;

 useEffect(() => {
 if (toast.duration <= 0) return;
 const start = Date.now();
 const interval = setInterval(() => {
 const elapsed = Date.now() - start;
 const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100);
 setProgress(remaining);
 if (remaining <= 0) clearInterval(interval);
 }, 50);
 return () => clearInterval(interval);
 }, [toast.duration]);

 return (
 <motion.div
 layout
 initial={{ opacity: 0, x: 80, scale: 0.9 }}
 animate={{ opacity: 1, x: 0, scale: 1 }}
 exit={{ opacity: 0, x: 80, scale: 0.9 }}
 transition={{ type: 'spring', stiffness: 500, damping: 35 }}
 className="toast-item"
 style={{
 background: 'var(--bg-surface)',
 border: `1px solid ${c.border}`,
 borderRadius: '16px',
 padding: '14px 16px',
 display: 'flex',
 alignItems: 'flex-start',
 gap: '12px',
 minWidth: '320px',
 maxWidth: '420px',
 boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
 position: 'relative',
 overflow: 'hidden',
 }}
 >
 <span style={{ color: c.icon, marginTop: '1px', flexShrink: 0 }}>{icons[toast.type]}</span>
 <p style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.5 }}>
 {toast.message}
 </p>
 <button
 onClick={() => onRemove(toast.id)}
 style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '1px', cursor: 'pointer', background: 'none', border: 'none' }}
 >
 <X size={16} />
 </button>
 {/* Progress bar */}
 <div style={{
 position: 'absolute',
 bottom: 0,
 left: 0,
 height: '3px',
 width: `${progress}%`,
 background: c.icon,
 borderRadius: '0 0 16px 16px',
 transition: 'width 0.1s linear',
 }} />
 </motion.div>
 );
}

export default function ToastContainer() {
 const { toasts, removeToast } = useToast();

 return (
 <div style={{
 position: 'fixed',
 bottom: '24px',
 right: '24px',
 zIndex: 9999,
 display: 'flex',
 flexDirection: 'column',
 gap: '8px',
 pointerEvents: 'none',
 }}>
 <AnimatePresence mode="popLayout">
 {toasts.map(toast => (
 <div key={toast.id} style={{ pointerEvents: 'auto' }}>
 <ToastItem toast={toast} onRemove={removeToast} />
 </div>
 ))}
 </AnimatePresence>
 </div>
 );
}
