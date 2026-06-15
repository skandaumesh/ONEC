'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useRef, useCallback } from 'react';

export function Button({
 children,
 variant = 'primary',
 size = 'md',
 loading = false,
 disabled = false,
 icon: Icon,
 fullWidth = false,
 onClick,
 type = 'button',
 className,
 ...props
}) {
 const baseStyles = 'btn transition-fast focus-visible rounded-lg font-medium';
 
 const variants = {
 primary: 'btn-primary hover:shadow-lg hover:scale-[1.02]',
 secondary: 'btn-secondary hover:bg-[var(--border-color)]',
 danger: 'btn-danger hover:shadow-lg hover:scale-[1.02]',
 ghost: 'bg-transparent hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)]',
 outline: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
 };

 const sizes = {
 sm: 'px-3 py-1.5 text-xs gap-1.5',
 md: 'px-4 py-2 text-sm gap-2',
 lg: 'px-6 py-3 text-base gap-2.5'
 };

 const buttonRef = useRef(null);

 // Ripple effect handler
 const handleClick = useCallback((e) => {
 if (loading || disabled) return;
 const btn = buttonRef.current;
 if (btn) {
 const rect = btn.getBoundingClientRect();
 const size = Math.max(rect.width, rect.height);
 const x = e.clientX - rect.left - size / 2;
 const y = e.clientY - rect.top - size / 2;
 const ripple = document.createElement('span');
 ripple.className = 'ripple-effect';
 ripple.style.width = ripple.style.height = `${size}px`;
 ripple.style.left = `${x}px`;
 ripple.style.top = `${y}px`;
 btn.appendChild(ripple);
 setTimeout(() => ripple.remove(), 700);
 }
 onClick?.(e);
 }, [loading, disabled, onClick]);

 return (
 <motion.button
 ref={buttonRef}
 type={type}
 onClick={handleClick}
 disabled={loading || disabled}
 whileHover={!disabled ? { y: -2 } : {}}
 whileTap={!disabled ? { scale: 0.98 } : {}}
 className={clsx(
 baseStyles,
 'ripple-container',
 variants[variant],
 sizes[size],
 fullWidth && 'w-full justify-center',
 (loading || disabled) && 'opacity-60 cursor-not-allowed',
 loading && 'shimmer-sweep',
 variant === 'primary' && 'gradient-shift-hover',
 className
 )}
 {...props}
 >
 {loading ? (
 <>
 <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
 Loading...
 </>
 ) : (
 <>
 {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
 {children}
 </>
 )}
 </motion.button>
 );
}

export function IconButton({ 
 icon: Icon, 
 variant = 'ghost', 
 size = 'md',
 onClick,
 className,
 ...props 
}) {
 const sizeMap = {
 sm: 'w-8 h-8',
 md: 'w-10 h-10',
 lg: 'w-12 h-12'
 };

 return (
 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={onClick}
 className={clsx(
 'flex items-center justify-center rounded-lg transition-fast',
 sizeMap[size],
 variant === 'ghost' && 'hover:bg-[var(--bg-surface-hover)]',
 variant === 'primary' && 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]',
 className
 )}
 {...props}
 >
 <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
 </motion.button>
 );
}

export function Badge({ 
 children, 
 variant = 'default',
 size = 'md',
 icon: Icon,
 className
}) {
 const variants = {
 default: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
 success: 'badge-success',
 warning: 'badge-warning',
 danger: 'badge-danger',
 info: 'badge-info'
 };

 const sizes = {
 sm: 'px-2 py-1 text-xs',
 md: 'px-3 py-1.5 text-sm',
 lg: 'px-4 py-2 text-base'
 };

 return (
 <span className={clsx(
 'badge inline-flex items-center gap-1.5 font-semibold rounded-full',
 variants[variant],
 sizes[size],
 className
 )}>
 {Icon && <Icon size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />}
 {children}
 </span>
 );
}

export function StatusBadge({ status, className }) {
 const statusMap = {
 active: { variant: 'success', label: 'Active' },
 inactive: { variant: 'danger', label: 'Inactive' },
 pending: { variant: 'warning', label: 'Pending' },
 completed: { variant: 'success', label: 'Completed' },
 in_progress: { variant: 'info', label: 'In Progress' }
 };

 const config = statusMap[status] || statusMap.pending;

 return (
 <Badge variant={config.variant} className={className}>
 {config.label}
 </Badge>
 );
}
