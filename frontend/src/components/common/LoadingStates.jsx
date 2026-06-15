import clsx from 'clsx';

// Skeleton Loader Component
export function SkeletonLoader({ width = 'w-full', height = 'h-4', className = '' }) {
 return <div className={clsx('skeleton', width, height, className)} />;
}

// Skeleton Text
export function SkeletonText({ lines = 3, className = '' }) {
 return (
 <div className={className}>
 {[...Array(lines)].map((_, i) => (
 <SkeletonLoader key={i} height="h-4" className={i < lines - 1 ? 'mb-2' : ''} />
 ))}
 </div>
 );
}

// Skeleton Card
export function SkeletonCard({ count = 3, className = '' }) {
 return (
 <div className={clsx('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
 {[...Array(count)].map((_, i) => (
 <div key={i} className="card">
 <SkeletonLoader height="h-48" className="mb-4" />
 <SkeletonText lines={2} className="mb-4" />
 <SkeletonLoader width="w-1/3" height="h-10" />
 </div>
 ))}
 </div>
 );
}

// Skeleton Avatar
export function SkeletonAvatar({ size = 'w-10 h-10', className = '' }) {
 return <SkeletonLoader width={size} height={size} className={clsx('rounded-full', className)} />;
}

// Spinner Loading Component
export function LoadingSpinner({ size = 'md', message = '' }) {
 const sizeMap = {
 sm: 'w-6 h-6',
 md: 'w-8 h-8',
 lg: 'w-12 h-12'
 };

 return (
 <div className="flex flex-col items-center justify-center gap-4">
 <div className={clsx(
 sizeMap[size],
 'border-4 border-[var(--border-color)] border-t-[var(--color-primary)] rounded-full animate-spin'
 )} />
 {message && <p style={{ color: 'var(--text-secondary)' }}>{message}</p>}
 </div>
 );
}

// Page Loading State
export function PageLoading({ message = 'Loading...' }) {
 return (
 <div className="min-h-[60vh] flex items-center justify-center">
 <LoadingSpinner size="lg" message={message} />
 </div>
 );
}

// Empty State Component
export function EmptyState({ 
 icon: Icon, 
 title, 
 description, 
 action,
 actionLabel = 'Take Action'
}) {
 return (
 <div className="flex flex-col items-center justify-center py-16 px-4">
 {Icon && <Icon size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />}
 <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
 {title}
 </h3>
 <p style={{ color: 'var(--text-secondary)' }} className="mb-6 max-w-md text-center">
 {description}
 </p>
 {action && (
 <button onClick={action} className="btn btn-primary">
 {actionLabel}
 </button>
 )}
 </div>
 );
}
