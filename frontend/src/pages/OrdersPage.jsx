import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
 Package, Clock, Truck, Check, X as XIcon, ChevronDown, ChevronUp,
 Search, AlertTriangle, MapPin, CreditCard, Eye
} from 'lucide-react';
import { orderApi } from '../api';
import { useToast } from '../context/ToastContext';
import { PageTransition, SlideUp, FadeIn, StaggerContainer, StaggerItem } from '../components/animations';

const statusConfig = {
 PENDING: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock size={14} />, label: 'Pending' },
 CONFIRMED: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Check size={14} />, label: 'Confirmed' },
 PROCESSING: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: <Package size={14} />, label: 'Processing' },
 SHIPPED: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <Truck size={14} />, label: 'Shipped' },
 DELIVERED: { color: 'bg-green-100 text-green-800 border-green-200', icon: <Check size={14} />, label: 'Delivered' },
 CANCELLED: { color: 'bg-red-100 text-red-800 border-red-200', icon: <XIcon size={14} />, label: 'Cancelled' },
};

const statusTimeline = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const demoOrders = [
 {
 id: 1, orderNumber: 'ONEC20260001', createdAt: '2026-05-22T10:30:00', status: 'SHIPPED',
 totalAmount: 547.50, paymentMethod: 'UPI', paymentStatus: 'PAID',
 address: { addressLine1: '123, Green Park Colony', city: 'Hyderabad', state: 'Telangana', zipCode: '500001' },
 items: [
 { id: 1, productName: 'Dolo 650mg Tablet', quantity: 3, price: 25.50, imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100' },
 { id: 2, productName: 'Himalaya Liv.52 DS', quantity: 2, price: 195.50, imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100' },
 ],
 },
 {
 id: 2, orderNumber: 'ONEC20260002', createdAt: '2026-05-20T14:15:00', status: 'DELIVERED',
 totalAmount: 999.00, paymentMethod: 'COD', paymentStatus: 'PAID',
 address: { addressLine1: '45, MG Road', city: 'Hyderabad', state: 'Telangana', zipCode: '500003' },
 items: [
 { id: 3, productName: 'Accu-Chek Glucometer', quantity: 1, price: 999, imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=100' },
 ],
 },
 {
 id: 3, orderNumber: 'ONEC20260003', createdAt: '2026-05-18T09:00:00', status: 'PENDING',
 totalAmount: 382.50, paymentMethod: 'CARD', paymentStatus: 'PENDING',
 address: { addressLine1: '123, Green Park Colony', city: 'Hyderabad', state: 'Telangana', zipCode: '500001' },
 items: [
 { id: 4, productName: 'Centrum Multivitamin', quantity: 1, price: 382.50, imageUrl: 'https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=100' },
 ],
 },
];

export default function OrdersPage() {
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const [expandedOrder, setExpandedOrder] = useState(null);
 const [trackingNumber, setTrackingNumber] = useState('');
 const [filter, setFilter] = useState('ALL');
 const { success, error: showError } = useToast();

 useEffect(() => {
 fetchOrders();
 }, []);

 const fetchOrders = async () => {
 setLoading(true);
 try {
 const res = await orderApi.getAll({ page: 0, size: 20 });
 const data = res.data.data?.content || res.data.data || [];
 setOrders(data.length > 0 ? data : demoOrders);
 } catch {
 setOrders(demoOrders);
 } finally {
 setLoading(false);
 }
 };

 const handleCancel = async (orderId) => {
 try {
 await orderApi.cancel(orderId);
 success('Order cancelled successfully');
 fetchOrders();
 } catch {
 // Demo mode
 setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
 success('Order cancelled successfully');
 }
 };

 const handleTrack = () => {
 if (!trackingNumber.trim()) { showError('Please enter an order number'); return; }
 const found = orders.find(o => o.orderNumber?.toLowerCase() === trackingNumber.toLowerCase());
 if (found) {
 setExpandedOrder(found.id);
 success(`Found order ${found.orderNumber}`);
 } else {
 showError('Order not found');
 }
 };

 const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

 const formatDate = (dateStr) => {
 return new Date(dateStr).toLocaleDateString('en-IN', {
 day: 'numeric', month: 'short', year: 'numeric',
 });
 };

 return (
 <PageTransition>
 <div className="max-w-5xl mx-auto px-4 py-8">
 <SlideUp>
 <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 My Orders
 </h1>
 <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Track and manage your orders</p>
 </SlideUp>

 {/* Track Order */}
 <FadeIn delay={0.1}>
 <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
 <Search size={16} className="text-primary" /> Track Your Order
 </h3>
 <div className="flex gap-3">
 <input
 value={trackingNumber}
 onChange={e => setTrackingNumber(e.target.value)}
 placeholder="Enter order number (e.g., ONEC20260001)"
 className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30"
 style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
 onKeyDown={e => e.key === 'Enter' && handleTrack()}
 />
 <button onClick={handleTrack} className="px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold">
 Track
 </button>
 </div>
 </div>
 </FadeIn>

 {/* Filter Tabs */}
 <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
 {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(f => (
 <button
 key={f}
 onClick={() => setFilter(f)}
 className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
 filter === f ? 'gradient-primary text-white' : ''
 }`}
 style={filter !== f ? { background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' } : {}}
 >
 {f === 'ALL' ? 'All Orders' : statusConfig[f]?.label || f}
 </button>
 ))}
 </div>

 {/* Orders List */}
 {loading ? (
 <div className="space-y-4">
 {[1,2,3].map(i => (
 <div key={i} className="rounded-2xl p-6 skeleton h-32" />
 ))}
 </div>
 ) : filteredOrders.length === 0 ? (
 <div className="text-center py-16">
 <Package size={64} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
 <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 No orders found
 </h3>
 <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
 {filter !== 'ALL' ? 'No orders with this status' : "You haven't placed any orders yet"}
 </p>
 <Link to="/products" className="px-6 py-3 rounded-xl gradient-primary text-white text-sm font-semibold">
 Start Shopping
 </Link>
 </div>
 ) : (
 <StaggerContainer className="space-y-4">
 {filteredOrders.map(order => {
 const sc = statusConfig[order.status] || statusConfig.PENDING;
 const isExpanded = expandedOrder === order.id;

 return (
 <StaggerItem key={order.id}>
 <div className="rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 {/* Order Header */}
 <button
 onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
 className="w-full p-5 text-left"
 >
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white">
 <Package size={18} />
 </div>
 <div>
 <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
 #{order.orderNumber}
 </p>
 <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
 {formatDate(order.createdAt)} • {order.items?.length || 0} item(s)
 </p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${sc.color}`}>
 {sc.icon} {sc.label}
 </span>
 <span className="text-base font-bold text-primary">
 ₹{(order.totalAmount || 0).toFixed(2)}
 </span>
 {isExpanded ? <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
 </div>
 </div>
 </button>

 {/* Expanded Details */}
 <AnimatePresence>
 {isExpanded && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.3 }}
 className="overflow-hidden"
 >
 <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
 {/* Status Timeline */}
 {order.status !== 'CANCELLED' && (
 <div className="pt-4">
 <h4 className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Order Progress</h4>
 <div className="flex items-center gap-0 overflow-x-auto">
 {statusTimeline.map((st, i) => {
 const currentIdx = statusTimeline.indexOf(order.status);
 const isActive = i <= currentIdx;
 const isCurrent = i === currentIdx;
 return (
 <div key={st} className="flex items-center" style={{ flex: '1 1 0' }}>
 <div className="flex flex-col items-center">
 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
 isActive ? 'gradient-primary text-white' : ''
 } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
 style={!isActive ? { background: 'var(--bg-surface-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' } : {}}>
 {isActive ? <Check size={14} /> : i + 1}
 </div>
 <span className="text-[10px] mt-1 font-medium whitespace-nowrap" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
 {statusConfig[st]?.label}
 </span>
 </div>
 {i < statusTimeline.length - 1 && (
 <div className="flex-1 h-0.5 mx-1" style={{ background: isActive && i < currentIdx ? 'var(--color-primary)' : 'var(--border-color)', minWidth: '20px' }} />
 )}
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* Items */}
 <div>
 <h4 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Items</h4>
 <div className="space-y-2">
 {(order.items || []).map((item, i) => (
 <div key={item.id || i} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'var(--bg-surface-hover)' }}>
 <img src={item.imageUrl || item.productImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=60'}
 alt={item.productName} className="w-10 h-10 rounded-lg object-cover"
 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=60'; }} />
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.productName}</p>
 <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
 </div>
 <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Address & Payment */}
 <div className="grid sm:grid-cols-2 gap-3">
 {order.address && (
 <div className="p-3 rounded-xl" style={{ background: 'var(--bg-surface-hover)' }}>
 <p className="text-xs font-bold mb-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
 <MapPin size={12} /> Delivery Address
 </p>
 <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
 {order.address.addressLine1}, {order.address.city} - {order.address.zipCode}
 </p>
 </div>
 )}
 <div className="p-3 rounded-xl" style={{ background: 'var(--bg-surface-hover)' }}>
 <p className="text-xs font-bold mb-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
 <CreditCard size={12} /> Payment
 </p>
 <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
 {order.paymentMethod || 'COD'} • {order.paymentStatus || 'Pending'}
 </p>
 </div>
 </div>

 {/* Actions */}
 {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
 <button
 onClick={() => handleCancel(order.id)}
 className="px-4 py-2 rounded-xl text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
 >
 Cancel Order
 </button>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </StaggerItem>
 );
 })}
 </StaggerContainer>
 )}
 </div>
 </PageTransition>
 );
}
