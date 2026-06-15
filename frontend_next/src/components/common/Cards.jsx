import clsx from 'clsx';
import { motion } from 'framer-motion';

export function Card({ 
 children, 
 hover = false, 
 glass = false,
 entrance = false,
 entranceDelay = 0,
 className,
 onClick,
 ...props 
}) {
 return (
 <motion.div
 whileHover={hover ? { y: -4 } : {}}
 className={clsx(
 'card',
 hover && 'cursor-pointer card-hover hover-border-gradient',
 glass && 'glass-noise',
 entrance && 'card-entrance',
 className
 )}
 style={entrance ? { '--entrance-delay': `${entranceDelay}s` } : undefined}
 onClick={onClick}
 {...props}
 >
 {children}
 </motion.div>
 );
}

export function GlassCard({ children, className, ...props }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className={clsx('glass-card', className)}
 {...props}
 >
 {children}
 </motion.div>
 );
}

export function CardHeader({ children, className }) {
 return (
 <div className={clsx('mb-4 pb-4 border-b border-[var(--border-color)]', className)}>
 {children}
 </div>
 );
}

export function CardBody({ children, className }) {
 return <div className={clsx('', className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
 return (
 <div className={clsx('mt-4 pt-4 border-t border-[var(--border-color)]', className)}>
 {children}
 </div>
 );
}

export function ProductCard({ product, onQuickView, onAddToCart, onAskAI, isCompared, onCompareToggle }) {
 return (
 <Card hover className="overflow-hidden group">
 {/* Image Container */}
 <div className="relative h-48 bg-[var(--bg-surface-hover)] rounded-lg overflow-hidden mb-4">
 {onCompareToggle && (
 <div className="absolute top-3 left-3 z-10">
 <input 
 type="checkbox" 
 checked={isCompared || false}
 onChange={(e) => onCompareToggle(product, e.target.checked)}
 className="w-5 h-5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer shadow-sm"
 title="Select to compare"
 onClick={(e) => e.stopPropagation()}
 />
 </div>
 )}
 {product.image ? (
 <img
 src={product.image}
 alt={product.name}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center">
 <span style={{ color: 'var(--text-muted)' }}>No Image</span>
 </div>
 )}
 
 {product.discount && (
 <div className="absolute top-3 right-3 bg-[var(--color-danger)] text-white px-3 py-1 rounded-full text-sm font-semibold">
 -{product.discount}%
 </div>
 )}
 </div>

 {/* Content */}
 <div className="flex flex-col flex-1">
 <h3 className="font-semibold text-sm line-clamp-2 mb-1" style={{ color: 'var(--text-primary)' }}>
 {product.name}
 </h3>
 
 <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
 {product.category}
 </p>

 {/* Price */}
 <div className="flex items-center gap-2 mb-4">
 <span className="text-lg font-bold text-[var(--color-primary)]">
 ₹{product.price}
 </span>
 {product.originalPrice && (
 <span className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>
 ₹{product.originalPrice}
 </span>
 )}
 </div>

 {/* Rating */}
 {product.rating && (
 <div className="flex items-center gap-1 mb-4">
 <span className="text-xs font-semibold text-[var(--color-primary)]">
 ★ {product.rating}
 </span>
 <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
 ({product.reviews || 0} reviews)
 </span>
 </div>
 )}

 {/* Actions */}
 <div className="flex gap-2 mt-auto">
 <button
 onClick={onAddToCart}
 className="flex-1 btn btn-primary text-xs py-2"
 >
 Add to Cart
 </button>
 <button
 onClick={onQuickView}
 className="flex-1 btn btn-secondary text-xs py-2"
 >
 View
 </button>
 <button
 onClick={(e) => { e.stopPropagation(); if(onAskAI) onAskAI(product); }}
 className="btn-shine bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border border-purple-500/20 p-2 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
 title="Ask AI what this is used for"
 >
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
 </button>
 </div>
 </div>
 </Card>
 );
}

export function StatCard({ icon: Icon, label, value, trend, className }) {
 return (
 <Card className={className}>
 <div className="flex items-start justify-between">
 <div className="flex-1">
 <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-1">
 {label}
 </p>
 <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
 {value}
 </h3>
 {trend && (
 <p className={`text-xs mt-2 ${trend > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
 {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
 </p>
 )}
 </div>
 {Icon && (
 <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
 <Icon size={24} style={{ color: 'var(--color-primary)' }} />
 </div>
 )}
 </div>
 </Card>
 );
}

export function FeatureCard({ icon: Icon, title, description, className }) {
 return (
 <Card className={className}>
 <div className="flex flex-col items-center text-center">
 {Icon && (
 <div className="mb-4 p-3 rounded-xl bg-[var(--color-primary)]/10">
 <Icon size={32} style={{ color: 'var(--color-primary)' }} />
 </div>
 )}
 <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
 {title}
 </h3>
 <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
 {description}
 </p>
 </div>
 </Card>
 );
}
