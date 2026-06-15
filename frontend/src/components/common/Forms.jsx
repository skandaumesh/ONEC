import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

export const TextInput = forwardRef(({
 label,
 error,
 success,
 helpText,
 icon: Icon,
 type = 'text',
 required = false,
 disabled = false,
 placeholder,
 className,
 ...props
}, ref) => {
 const [showPassword, setShowPassword] = useState(false);
 const isPassword = type === 'password';

 return (
 <div className="form-group">
 {label && (
 <label className="form-label">
 {label}
 {required && <span className="text-[var(--color-danger)]">*</span>}
 </label>
 )}
 <div className="relative">
 {Icon && (
 <Icon
 size={18}
 className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
 style={{ color: 'var(--text-muted)' }}
 />
 )}
 <input
 ref={ref}
 type={isPassword && !showPassword ? 'password' : 'text'}
 disabled={disabled}
 placeholder={placeholder}
 className={clsx(
 'form-input w-full transition-all',
 Icon && 'pl-10',
 error && 'border-[var(--color-danger)] focus:border-[var(--color-danger)]',
 success && 'border-[var(--color-success)] focus:border-[var(--color-success)]',
 disabled && 'opacity-50 cursor-not-allowed',
 className
 )}
 {...props}
 />
 {isPassword && (
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
 >
 {showPassword ? (
 <EyeOff size={18} style={{ color: 'var(--text-muted)' }} />
 ) : (
 <Eye size={18} style={{ color: 'var(--text-muted)' }} />
 )}
 </button>
 )}
 {error && (
 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-1/2 -translate-y-1/2">
 <AlertCircle size={18} className="text-[var(--color-danger)]" />
 </motion.div>
 )}
 {success && !error && (
 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-1/2 -translate-y-1/2">
 <CheckCircle size={18} className="text-[var(--color-success)]" />
 </motion.div>
 )}
 </div>
 {error && (
 <motion.p
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="text-xs text-[var(--color-danger)] mt-1"
 >
 {error}
 </motion.p>
 )}
 {helpText && !error && (
 <p className="text-xs text-[var(--text-muted)] mt-1">{helpText}</p>
 )}
 </div>
 );
});

TextInput.displayName = 'TextInput';

export const TextArea = forwardRef(({
 label,
 error,
 success,
 helpText,
 required = false,
 disabled = false,
 placeholder,
 rows = 4,
 className,
 ...props
}, ref) => {
 return (
 <div className="form-group">
 {label && (
 <label className="form-label">
 {label}
 {required && <span className="text-[var(--color-danger)]">*</span>}
 </label>
 )}
 <textarea
 ref={ref}
 disabled={disabled}
 placeholder={placeholder}
 rows={rows}
 className={clsx(
 'form-input w-full resize-none transition-all',
 error && 'border-[var(--color-danger)]',
 success && 'border-[var(--color-success)]',
 disabled && 'opacity-50 cursor-not-allowed',
 className
 )}
 {...props}
 />
 {error && (
 <p className="text-xs text-[var(--color-danger)] mt-1">{error}</p>
 )}
 {helpText && !error && (
 <p className="text-xs text-[var(--text-muted)] mt-1">{helpText}</p>
 )}
 </div>
 );
});

TextArea.displayName = 'TextArea';

export const Select = forwardRef(({
 label,
 error,
 success,
 helpText,
 options = [],
 required = false,
 disabled = false,
 placeholder = 'Select an option',
 className,
 ...props
}, ref) => {
 return (
 <div className="form-group">
 {label && (
 <label className="form-label">
 {label}
 {required && <span className="text-[var(--color-danger)]">*</span>}
 </label>
 )}
 <select
 ref={ref}
 disabled={disabled}
 className={clsx(
 'form-input w-full transition-all appearance-none bg-[var(--bg-primary)]',
 error && 'border-[var(--color-danger)]',
 success && 'border-[var(--color-success)]',
 disabled && 'opacity-50 cursor-not-allowed',
 className
 )}
 style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M1 4l5 5 5-5'/%3E%3C/svg%3E")`,
 backgroundRepeat: 'no-repeat',
 backgroundPosition: 'right 0.75rem center',
 backgroundSize: '1rem',
 paddingRight: '2.5rem'
 }}
 {...props}
 >
 <option value="">{placeholder}</option>
 {options.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 {error && (
 <p className="text-xs text-[var(--color-danger)] mt-1">{error}</p>
 )}
 {helpText && !error && (
 <p className="text-xs text-[var(--text-muted)] mt-1">{helpText}</p>
 )}
 </div>
 );
});

Select.displayName = 'Select';

export const Checkbox = forwardRef(({
 label,
 error,
 helpText,
 className,
 ...props
}, ref) => {
 return (
 <div className="form-group">
 <label className="flex items-center gap-3 cursor-pointer">
 <input
 ref={ref}
 type="checkbox"
 className={clsx(
 'w-4 h-4 rounded border border-[var(--border-color)] cursor-pointer accent-[var(--color-primary)]',
 error && 'border-[var(--color-danger)]',
 className
 )}
 {...props}
 />
 <span style={{ color: 'var(--text-secondary)' }} className="text-sm">
 {label}
 </span>
 </label>
 {error && (
 <p className="text-xs text-[var(--color-danger)] mt-1">{error}</p>
 )}
 {helpText && !error && (
 <p className="text-xs text-[var(--text-muted)] mt-1">{helpText}</p>
 )}
 </div>
 );
});

Checkbox.displayName = 'Checkbox';

export const RadioGroup = forwardRef(({
 label,
 options = [],
 error,
 helpText,
 required = false,
 className,
 ...props
}, ref) => {
 return (
 <div className="form-group">
 {label && (
 <label className="form-label">
 {label}
 {required && <span className="text-[var(--color-danger)]">*</span>}
 </label>
 )}
 <div className={clsx('space-y-2', className)}>
 {options.map((option) => (
 <label key={option.value} className="flex items-center gap-3 cursor-pointer">
 <input
 type="radio"
 value={option.value}
 className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
 {...props}
 />
 <span style={{ color: 'var(--text-secondary)' }} className="text-sm">
 {option.label}
 </span>
 </label>
 ))}
 </div>
 {error && (
 <p className="text-xs text-[var(--color-danger)] mt-1">{error}</p>
 )}
 {helpText && !error && (
 <p className="text-xs text-[var(--text-muted)] mt-1">{helpText}</p>
 )}
 </div>
 );
});

RadioGroup.displayName = 'RadioGroup';

export const Form = ({ children, onSubmit, className, ...props }) => (
 <form onSubmit={onSubmit} className={clsx('space-y-4', className)} {...props}>
 {children}
 </form>
);
