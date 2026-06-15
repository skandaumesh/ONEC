import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export const Modal = ({
 isOpen,
 onClose,
 title,
 children,
 actions,
 size = 'md',
 className
}) => {
 const sizeClasses = {
 sm: 'max-w-sm',
 md: 'max-w-md',
 lg: 'max-w-lg',
 xl: 'max-w-xl',
 '2xl': 'max-w-2xl'
 };

 return (
 <AnimatePresence>
 {isOpen && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="modal-backdrop"
 />
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className={clsx(
 'modal-content p-6 w-11/12',
 sizeClasses[size],
 className
 )}
 >
 <div className="flex items-center justify-between mb-4">
 {title && (
 <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
 {title}
 </h2>
 )}
 <button
 onClick={onClose}
 className="p-1 hover:bg-[var(--bg-surface-hover)] rounded-lg transition-colors"
 >
 <X size={24} style={{ color: 'var(--text-muted)' }} />
 </button>
 </div>
 <div className="mb-6">{children}</div>
 {actions && (
 <div className="flex gap-3 justify-end">
 {actions}
 </div>
 )}
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
};

export const Alert = ({ variant = 'info', title, message, icon: Icon, onClose }) => {
 const variants = {
 info: {
 bg: 'bg-blue-50 ',
 border: 'border-blue-200 ',
 icon: Icon || Info,
 iconColor: 'text-blue-600'
 },
 success: {
 bg: 'bg-green-50 ',
 border: 'border-green-200 ',
 icon: Icon || CheckCircle,
 iconColor: 'text-green-600'
 },
 warning: {
 bg: 'bg-yellow-50 ',
 border: 'border-yellow-200 ',
 icon: Icon || AlertTriangle,
 iconColor: 'text-yellow-600'
 },
 error: {
 bg: 'bg-red-50 ',
 border: 'border-red-200 ',
 icon: Icon || AlertCircle,
 iconColor: 'text-red-600'
 }
 };

 const config = variants[variant];
 const AlertIcon = config.icon;

 return (
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 className={clsx(
 'flex gap-4 p-4 rounded-lg border',
 config.bg,
 config.border
 )}
 >
 <AlertIcon size={20} className={clsx('flex-shrink-0 mt-0.5', config.iconColor)} />
 <div className="flex-1">
 {title && (
 <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
 {title}
 </h3>
 )}
 {message && (
 <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
 {message}
 </p>
 )}
 </div>
 {onClose && (
 <button
 onClick={onClose}
 className="p-1 hover:bg-white/50 rounded transition-colors flex-shrink-0"
 >
 <X size={18} style={{ color: 'var(--text-muted)' }} />
 </button>
 )}
 </motion.div>
 );
};

export const Toast = ({
 variant = 'info',
 title,
 message,
 action,
 actionLabel = 'Undo',
 duration = 5000,
 onClose
}) => {
 const variants = {
 info: 'bg-[var(--color-info)] text-white',
 success: 'bg-[var(--color-success)] text-white',
 warning: 'bg-[var(--color-warning)] text-white',
 error: 'bg-[var(--color-danger)] text-white'
 };

 return (
 <motion.div
 initial={{ opacity: 0, x: 20, y: 100 }}
 animate={{ opacity: 1, x: 0, y: 0 }}
 exit={{ opacity: 0, x: 20, y: 100 }}
 className={clsx(
 'rounded-lg p-4 shadow-lg max-w-sm flex items-center gap-4',
 variants[variant]
 )}
 >
 <div className="flex-1">
 {title && <h4 className="font-semibold text-sm">{title}</h4>}
 {message && <p className="text-sm opacity-90">{message}</p>}
 </div>
 {action && (
 <button
 onClick={action}
 className="text-sm font-semibold hover:underline flex-shrink-0"
 >
 {actionLabel}
 </button>
 )}
 {onClose && (
 <button
 onClick={onClose}
 className="p-1 hover:bg-white/20 rounded transition-colors"
 >
 <X size={16} />
 </button>
 )}
 </motion.div>
 );
};

export const Tabs = ({ tabs, defaultTab = 0, onTabChange }) => {
 const [activeTab, setActiveTab] = React.useState(defaultTab);

 const handleTabChange = (index) => {
 setActiveTab(index);
 onTabChange?.(index);
 };

 return (
 <div>
 <div className="flex gap-1 border-b border-[var(--border-color)]">
 {tabs.map((tab, index) => (
 <button
 key={index}
 onClick={() => handleTabChange(index)}
 className={clsx(
 'px-4 py-3 font-medium text-sm border-b-2 transition-colors',
 activeTab === index
 ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
 : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
 )}
 >
 {tab.label}
 </button>
 ))}
 </div>
 <div className="py-4">
 {tabs[activeTab]?.content}
 </div>
 </div>
 );
};

export const Accordion = ({ items }) => {
 const [openIndex, setOpenIndex] = React.useState(null);

 return (
 <div className="space-y-2 border border-[var(--border-color)] rounded-lg overflow-hidden">
 {items.map((item, index) => (
 <div key={index} className="border-b border-[var(--border-color)] last:border-b-0">
 <button
 onClick={() => setOpenIndex(openIndex === index ? null : index)}
 className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-surface-hover)] transition-colors"
 >
 <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
 {item.title}
 </h3>
 <motion.div
 animate={{ rotate: openIndex === index ? 180 : 0 }}
 transition={{ duration: 0.2 }}
 >
 <svg
 className="w-5 h-5"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M19 14l-7 7m0 0l-7-7m7 7V3"
 />
 </svg>
 </motion.div>
 </button>
 <AnimatePresence>
 {openIndex === index && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="overflow-hidden border-t border-[var(--border-color)]"
 >
 <div className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>
 {item.content}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 ))}
 </div>
 );
};

import React from 'react';
