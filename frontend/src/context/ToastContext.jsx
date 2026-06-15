import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
 const [toasts, setToasts] = useState([]);
 const timersRef = useRef({});

 const removeToast = useCallback((id) => {
 setToasts(prev => prev.filter(t => t.id !== id));
 if (timersRef.current[id]) {
 clearTimeout(timersRef.current[id]);
 delete timersRef.current[id];
 }
 }, []);

 const addToast = useCallback((message, type = 'info', duration = 4000) => {
 const id = ++toastId;
 const toast = { id, message, type, createdAt: Date.now(), duration };
 setToasts(prev => [...prev.slice(-4), toast]); // max 5 toasts

 if (duration > 0) {
 timersRef.current[id] = setTimeout(() => {
 removeToast(id);
 }, duration);
 }

 return id;
 }, [removeToast]);

 const success = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast]);
 const error = useCallback((msg, dur) => addToast(msg, 'error', dur), [addToast]);
 const warning = useCallback((msg, dur) => addToast(msg, 'warning', dur), [addToast]);
 const info = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast]);

 return (
 <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
 {children}
 </ToastContext.Provider>
 );
}

export function useToast() {
 const context = useContext(ToastContext);
 if (!context) throw new Error('useToast must be used within ToastProvider');
 return context;
}

export default ToastContext;
