"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
 MapPin, CreditCard, Package, Check, ChevronRight, Plus,
 Truck, ArrowRight, Loader2, ShoppingBag, ChevronLeft, Banknote, Smartphone, HelpCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { orderApi, userApi, paymentApi } from '@/api';
import { PageTransition, FadeIn, SlideUp } from '@/components/animations';

const steps = [
 { id: 1, label: 'Address', icon: <MapPin size={18} /> },
 { id: 2, label: 'Payment', icon: <CreditCard size={18} /> },
 { id: 3, label: 'Review', icon: <Package size={18} /> },
];

const demoAddresses = [
 { id: 1, addressLine1: '123, Green Park Colony', addressLine2: 'Near City Hospital', city: 'Hyderabad', state: 'Telangana', zipCode: '500001', isDefault: true },
 { id: 2, addressLine1: '45, MG Road', addressLine2: 'Beside Metro Station', city: 'Hyderabad', state: 'Telangana', zipCode: '500003', isDefault: false },
];

const loadRazorpayScript = () => {
 return new Promise((resolve) => {
 if (window.Razorpay) {
 resolve(true);
 return;
 }
 const script = document.createElement('script');
 script.src = 'https://checkout.razorpay.com/v1/checkout.js';
 script.onload = () => resolve(true);
 script.onerror = () => resolve(false);
 document.body.appendChild(script);
 });
};

export default function CheckoutPage() {
 const router = useRouter();
 const { cart, clearCart } = useCart();
 const { user } = useAuth();
 const { success, error: showError, info } = useToast();

 const [step, setStep] = useState(1);
 const [addresses, setAddresses] = useState([]);
 const [selectedAddress, setSelectedAddress] = useState(null);
 const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, CARD, UPI, NETBANKING
 const [selectedBank, setSelectedBank] = useState('SBI');
 const [placing, setPlacing] = useState(false);
 const [orderPlaced, setOrderPlaced] = useState(false);
 const [orderNumber, setOrderNumber] = useState('');
 const [showAddForm, setShowAddForm] = useState(false);
 const [newAddress, setNewAddress] = useState({ addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '' });

 const items = cart?.items || [];
 const subtotal = cart?.totalPrice || items.reduce((sum, i) => sum + (i.price || i.sellingPrice || 0) * i.quantity, 0);
 const discount = cart?.totalDiscount || 0;
 const deliveryFee = subtotal >= 499 ? 0 : 49;
 const total = subtotal - discount + deliveryFee;

 useEffect(() => {
 fetchAddresses();
 }, []);

 const fetchAddresses = async () => {
 try {
 const res = await userApi.getProfile();
 const addrs = res.data.data?.addresses || [];
 setAddresses(addrs.length > 0 ? addrs : demoAddresses);
 const def = addrs.find(a => a.isDefault) || addrs[0];
 if (def) setSelectedAddress(def.id);
 } catch {
 setAddresses(demoAddresses);
 setSelectedAddress(demoAddresses[0].id);
 }
 };

 const handleAddAddress = () => {
 if (!newAddress.addressLine1 || !newAddress.city || !newAddress.zipCode) {
 showError('Please fill required fields');
 return;
 }
 const addr = { ...newAddress, id: Date.now(), isDefault: addresses.length === 0 };
 setAddresses(prev => [...prev, addr]);
 setSelectedAddress(addr.id);
 setShowAddForm(false);
 setNewAddress({ addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '' });
 success('Address added!');
 };

 const handlePlaceOrder = async () => {
 if (!selectedAddress) {
 showError('Please select a delivery address');
 return;
 }

 setPlacing(true);
 try {
 // 1. Place the domestic pending order
 const orderRes = await orderApi.place({
 addressId: selectedAddress,
 paymentMethod: paymentMethod === 'COD' ? 'COD' : 'ONLINE',
 });

 const orderData = orderRes.data.data;
 const orderId = orderData.id;
 const orderNum = orderData.orderNumber;

 // 2. Complete payment based on selection
 if (paymentMethod === 'COD') {
 await paymentApi.completeCodPayment(orderId);
 setOrderNumber(orderNum);
 setOrderPlaced(true);
 clearCart();
 success('Order placed successfully! 🎉');
 } else {
 // Online via Razorpay
 const scriptLoaded = await loadRazorpayScript();
 if (!scriptLoaded) {
 showError('Failed to load payment portal! Check your internet connection.');
 setPlacing(false);
 return;
 }

 const rzpRes = await paymentApi.createRazorpayOrder(orderId);
 const rzpOrder = rzpRes.data.data;

 const options = {
 key: rzpOrder.keyId,
 amount: rzpOrder.amount * 100, // paise
 currency: rzpOrder.currency,
 name: "ONEC Pharmacy",
 description: "Premium Wellness Checkout",
 order_id: rzpOrder.razorpayOrderId,
 handler: async function (response) {
 setPlacing(true);
 try {
 await paymentApi.verifyRazorpayPayment({
 orderId: rzpOrder.orderId,
 razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
 razorpayOrderId: response.razorpay_order_id,
 razorpaySignature: response.razorpay_signature || "simulated_signature",
 });
 setOrderNumber(rzpOrder.orderNumber);
 setOrderPlaced(true);
 clearCart();
 success('Payment verified & Order Confirmed! 🎉');
 } catch (err) {
 showError('Payment signature validation failed!');
 } finally {
 setPlacing(false);
 }
 },
 prefill: {
 name: user?.fullName || user?.name || "Customer",
 email: user?.email || "customer@onecpharma.com",
 contact: user?.phone || "9999999999"
 },
 notes: {
 address: "Delivery to ONEC Pharmacy Address"
 },
 theme: {
 color: "#0D47A1"
 },
 modal: {
 ondismiss: function() {
 setPlacing(false);
 showError('Payment checkout closed.');
 }
 }
 };

 // Fallback for simulated order IDs (demo keys)
 if (rzpOrder.razorpayOrderId.startsWith("order_sim_")) {
 info("🔔 Demo payment mode activated. Initializing checkout overlay...");
 setTimeout(() => {
 const confirmSim = window.confirm(
 "💳 SIMULATED PAYMENT GATEWAY\n\nMerchant: ONEC Pharmacy\nAmount: ₹" + 
 rzpOrder.amount.toFixed(2) + "\n\nWould you like to simulate a successful payment authorization?"
 );
 if (confirmSim) {
 options.handler({
 razorpay_payment_id: "pay_sim_" + Date.now(),
 razorpay_order_id: rzpOrder.razorpayOrderId,
 razorpay_signature: "simulated_signature"
 });
 } else {
 setPlacing(false);
 showError('Simulated checkout cancelled.');
 }
 }, 800);
 } else {
 const rzp = new window.Razorpay(options);
 rzp.open();
 }
 }
 } catch (err) {
 showError(err.response?.data?.message || 'Failed to place order. Please try again.');
 setPlacing(false);
 }
 };

 // Order success screen
 if (orderPlaced) {
 return (
 <PageTransition>
 <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
 <motion.div
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ type: 'spring', stiffness: 300, damping: 25 }}
 className="max-w-md w-full text-center"
 >
 <div className="rounded-3xl p-8 shadow-2xl glass-card border border-[var(--border-color)]/60">
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
 className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 text-emerald-500"
 >
 <Check size={40} />
 </motion.div>
 <h1 className="text-2xl font-black mb-2 tracking-tight text-[var(--text-primary)]">
 Order Confirmed!
 </h1>
 <p className="text-sm mb-1 text-[var(--text-secondary)] font-medium">
 Your order has been placed successfully.
 </p>
 <div className="py-3 px-4 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 my-5">
 <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Order Number</p>
 <p className="text-xl font-black text-[var(--color-primary)] ">{orderNumber}</p>
 </div>
 <p className="text-xs mb-6 text-[var(--text-muted)] font-medium leading-relaxed">
 We've sent updates on your order status and invoice confirmation via your registered email.
 </p>
 <div className="flex gap-3">
 <Link href="/orders"
 className="flex-1 py-3 rounded-2xl font-bold text-sm text-[var(--text-secondary)] hover:bg-black/5 transition-all text-center border border-[var(--border-color)]">
 Track Order
 </Link>
 <Link href="/products"
 className="flex-1 py-3 rounded-2xl gradient-primary text-white font-bold text-sm hover:opacity-90 shadow-md hover:shadow-lg transition-all text-center">
 Shop More
 </Link>
 </div>
 </div>
 </motion.div>
 </div>
 </PageTransition>
 );
 }

 // Empty cart guard
 if (items.length === 0 && !orderPlaced) {
 return (
 <PageTransition>
 <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
 <ShoppingBag size={64} className="text-primary/30 mb-4 animate-pulse" />
 <h2 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
 Your cart is empty
 </h2>
 <p className="text-sm mb-6 text-[var(--text-secondary)]">Add some items to proceed with checkout</p>
 <Link href="/products" className="px-6 py-3 rounded-xl gradient-primary text-white text-sm font-semibold">
 Browse Products
 </Link>
 </div>
 </PageTransition>
 );
 }

 const selectedAddr = addresses.find(a => a.id === selectedAddress);

 return (
 <PageTransition>
 <div className="max-w-5xl mx-auto px-4 py-8">
 {/* Header */}
 <SlideUp>
 <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2 text-[var(--text-primary)]">
 Checkout
 </h1>
 </SlideUp>

 {/* Steps */}
 <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
 {steps.map((s, i) => (
 <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
 <button
 onClick={() => { if (s.id < step) setStep(s.id); }}
 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
 step === s.id ? 'gradient-primary text-white shadow-md' :
 step > s.id ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : ''
 }`}
 style={step < s.id ? { background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' } : {}}
 >
 {step > s.id ? <Check size={14} /> : s.icon}
 <span>{s.label}</span>
 </button>
 {i < steps.length - 1 && (
 <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
 )}
 </div>
 ))}
 </div>

 <div className="grid md:grid-cols-3 gap-6">
 {/* Main Content */}
 <div className="md:col-span-2">
 <AnimatePresence mode="wait">
 {/* Step 1: Address */}
 {step === 1 && (
 <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <div className="rounded-3xl p-6 glass-card border border-[var(--border-color)]/60">
 <h2 className="text-lg font-black mb-5 tracking-tight text-[var(--text-primary)]">
 Select Delivery Address
 </h2>
 <div className="space-y-3">
 {addresses.map(addr => (
 <label
 key={addr.id}
 className={`block p-4 rounded-2xl cursor-pointer transition-all ${
 selectedAddress === addr.id ? 'ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/3 ' : 'hover:bg-[var(--bg-surface-hover)]'
 }`}
 style={{ border: `1px solid ${selectedAddress === addr.id ? 'transparent' : 'var(--border-color)'}` }}
 >
 <div className="flex items-start gap-3">
 <input
 type="radio"
 name="address"
 checked={selectedAddress === addr.id}
 onChange={() => setSelectedAddress(addr.id)}
 className="mt-1 accent-blue-600 cursor-pointer"
 />
 <div className="flex-1">
 <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
 {addr.addressLine1}
 </p>
 {addr.addressLine2 && (
 <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{addr.addressLine2}</p>
 )}
 <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-secondary)' }}>
 {addr.city}, {addr.state} - {addr.zipCode}
 </p>
 {addr.isDefault && (
 <span className="inline-block mt-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">Default</span>
 )}
 </div>
 </div>
 </label>
 ))}

 {/* Add new address */}
 {showAddForm ? (
 <div className="p-5 rounded-2xl space-y-3" style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)' }}>
 <input placeholder="Address Line 1 *" value={newAddress.addressLine1}
 onChange={e => setNewAddress({...newAddress, addressLine1: e.target.value})}
 className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-primary transition-all focus:ring-1 focus:ring-primary" />
 <input placeholder="Address Line 2" value={newAddress.addressLine2}
 onChange={e => setNewAddress({...newAddress, addressLine2: e.target.value})}
 className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-primary transition-all focus:ring-1 focus:ring-primary" />
 <div className="grid grid-cols-3 gap-3">
 <input placeholder="City *" value={newAddress.city}
 onChange={e => setNewAddress({...newAddress, city: e.target.value})}
 className="px-4 py-3 rounded-xl text-sm outline-none bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-primary transition-all focus:ring-1 focus:ring-primary" />
 <input placeholder="State" value={newAddress.state}
 onChange={e => setNewAddress({...newAddress, state: e.target.value})}
 className="px-4 py-3 rounded-xl text-sm outline-none bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-primary transition-all focus:ring-1 focus:ring-primary" />
 <input placeholder="ZIP *" value={newAddress.zipCode}
 onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})}
 className="px-4 py-3 rounded-xl text-sm outline-none bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-primary transition-all focus:ring-1 focus:ring-primary" />
 </div>
 <div className="flex gap-2.5 pt-2">
 <button onClick={handleAddAddress} className="px-5 py-2.5 rounded-xl gradient-primary text-white text-xs font-bold uppercase tracking-wider shadow-md">Save Address</button>
 <button onClick={() => setShowAddForm(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Cancel</button>
 </div>
 </div>
 ) : (
 <button onClick={() => setShowAddForm(true)}
 className="w-full py-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all cursor-pointer"
 style={{ borderColor: 'var(--border-color)' }}>
 <Plus size={16} /> Add New Address
 </button>
 )}
 </div>

 <button onClick={() => { if (selectedAddress) setStep(2); else showError('Please select an address'); }}
 className="w-full mt-8 py-3.5 rounded-2xl gradient-primary text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]">
 Continue to Payment <ArrowRight size={16} />
 </button>
 </div>
 </motion.div>
 )}

 {/* Step 2: Payment */}
 {step === 2 && (
 <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <div className="rounded-3xl p-6 glass-card border border-[var(--border-color)]/60">
 <h2 className="text-lg font-black mb-1 tracking-tight text-[var(--text-primary)]">
 Payment Options
 </h2>
 <p className="text-xs text-[var(--text-muted)] font-medium mb-6">Select a secure payment channel powered by Razorpay</p>
 
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
 {[
 { id: 'COD', label: 'Cash / COD', icon: <Banknote size={18} /> },
 { id: 'UPI', label: 'UPI / QR Code', icon: <Smartphone size={18} /> },
 { id: 'CARD', label: 'Credit Card', icon: <CreditCard size={18} /> },
 { id: 'NETBANKING', label: 'Net Banking', icon: <HelpCircle size={18} /> },
 ].map(pm => (
 <button
 key={pm.id}
 onClick={() => setPaymentMethod(pm.id)}
 className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all border ${
 paymentMethod === pm.id
 ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-bold'
 : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
 }`}
 >
 <span className={`${paymentMethod === pm.id ? 'scale-110' : ''} transition-transform`}>{pm.icon}</span>
 <span className="text-[10px] uppercase font-bold tracking-wider">{pm.label}</span>
 </button>
 ))}
 </div>

 {/* Tab panels details */}
 <div className="p-5 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)]/50 min-h-[160px] flex flex-col justify-center">
 {paymentMethod === 'COD' && (
 <div>
 <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">Cash on Delivery (COD)</h4>
 <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">No immediate charges! Place your order now and pay at your doorstep when the delivery partner arrives. We accept Cash, UPI scanner, and Card swipes at the time of delivery.</p>
 </div>
 )}

 {paymentMethod === 'UPI' && (
 <div className="flex flex-col items-center text-center">
 <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">Simulated UPI & Instant QR Code</h4>
 <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium max-w-sm mb-4">Scan our dynamic QR code or use GPay, PhonePe, and Paytm. Simulated local validation allows automated testing.</p>
 
 {/* DYNAMIC UPI VECTOR QR BOX */}
 <div className="w-32 h-32 bg-white p-2.5 rounded-2xl shadow-md border border-slate-100 flex items-center justify-center relative">
 <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
 <rect x="5" y="5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="5" />
 <rect x="10" y="10" width="12" height="12" fill="currentColor" />
 <rect x="73" y="5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="5" />
 <rect x="78" y="10" width="12" height="12" fill="currentColor" />
 <rect x="5" y="73" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="5" />
 <rect x="10" y="78" width="12" height="12" fill="currentColor" />
 <rect x="35" y="5" width="10" height="15" fill="currentColor" />
 <rect x="50" y="15" width="15" height="10" fill="currentColor" />
 <rect x="35" y="25" width="25" height="5" fill="currentColor" />
 <rect x="5" y="35" width="15" height="10" fill="currentColor" />
 <rect x="25" y="35" width="30" height="15" fill="currentColor" />
 <rect x="60" y="35" width="15" height="5" fill="currentColor" />
 <rect x="80" y="35" width="15" height="15" fill="currentColor" />
 <rect x="5" y="50" width="10" height="15" fill="currentColor" />
 <rect x="20" y="55" width="15" height="10" fill="currentColor" />
 <rect x="40" y="55" width="10" height="5" fill="currentColor" />
 <rect x="55" y="50" width="20" height="15" fill="currentColor" />
 <rect x="80" y="55" width="10" height="10" fill="currentColor" />
 <rect x="35" y="73" width="15" height="10" fill="currentColor" />
 <rect x="55" y="73" width="10" height="22" fill="currentColor" />
 <rect x="73" y="73" width="22" height="10" fill="currentColor" />
 <rect x="35" y="88" width="15" height="7" fill="currentColor" />
 <rect x="73" y="88" width="10" height="7" fill="currentColor" />
 <rect x="88" y="88" width="7" height="7" fill="currentColor" />
 <rect x="43" y="43" width="14" height="14" rx="3" fill="white" stroke="currentColor" strokeWidth="2.5" />
 <circle cx="50" cy="50" r="4" fill="#0D47A1" />
 </svg>
 </div>
 </div>
 )}

 {paymentMethod === 'CARD' && (
 <div>
 <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">Debit & Credit Cards</h4>
 <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium mb-3">Accepts all domestic and international Visa, MasterCard, Maestro, RuPay, and American Express cards.</p>
 <div className="flex gap-2">
 {['visa', 'mastercard', 'rupay', 'amex'].map(c => (
 <div key={c} className="px-2 py-1 rounded bg-white text-[8px] font-black uppercase border tracking-wider text-[var(--text-muted)] border-[var(--border-color)]">
 {c}
 </div>
 ))}
 </div>
 </div>
 )}

 {paymentMethod === 'NETBANKING' && (
 <div>
 <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">Net Banking</h4>
 <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium mb-4">Direct secure portal transfer from top domestic retail banks.</p>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
 {['SBI', 'HDFC', 'ICICI', 'AXIS'].map(bank => (
 <button
 key={bank}
 onClick={() => { setSelectedBank(bank); success(`${bank} selected for secure routing`); }}
 className={`py-1.5 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${
 selectedBank === bank
 ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]'
 : 'bg-white border-[var(--border-color)] text-[var(--text-muted)]'
 }`}
 >
 {bank}
 </button>
 ))}
 </div>
 </div>
 )}
 </div>

 <div className="flex gap-3 mt-8">
 <button onClick={() => setStep(1)}
 className="px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-black/5">
 <ChevronLeft size={16} /> Back
 </button>
 <button onClick={() => setStep(3)}
 className="flex-1 py-3.5 rounded-2xl gradient-primary text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer">
 Review Order <ArrowRight size={16} />
 </button>
 </div>
 </div>
 </motion.div>
 )}

 {/* Step 3: Review */}
 {step === 3 && (
 <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <div className="rounded-3xl p-6 glass-card border border-[var(--border-color)]/60 space-y-6">
 <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)]">
 Review Your Order
 </h2>

 {/* Address summary */}
 <div className="p-4 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)]/50">
 <div className="flex items-center justify-between mb-2">
 <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[var(--text-primary)]">
 <MapPin size={16} className="text-[var(--color-primary)]" /> Delivery Address
 </h3>
 <button onClick={() => setStep(1)} className="text-xs text-[var(--color-primary)] font-bold cursor-pointer hover:underline">Change</button>
 </div>
 {selectedAddr && (
 <p className="text-xs font-medium text-[var(--text-secondary)] leading-relaxed">
 {selectedAddr.addressLine1}, {selectedAddr.addressLine2 ? `${selectedAddr.addressLine2}, ` : ''}{selectedAddr.city}, {selectedAddr.state} - {selectedAddr.zipCode}
 </p>
 )}
 </div>

 {/* Payment summary */}
 <div className="p-4 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)]/50">
 <div className="flex items-center justify-between mb-2">
 <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-[var(--text-primary)]">
 <CreditCard size={16} className="text-[var(--color-primary)]" /> Payment Method
 </h3>
 <button onClick={() => setStep(2)} className="text-xs text-[var(--color-primary)] font-bold cursor-pointer hover:underline">Change</button>
 </div>
 <p className="text-xs font-bold text-[var(--text-primary)]">
 {paymentMethod === 'COD' ? '💰 Cash on Delivery' : 
 paymentMethod === 'UPI' ? '📱 Instant UPI / QR Code' : 
 paymentMethod === 'CARD' ? '💳 Credit / Debit Card' : `🏛️ Net Banking (${selectedBank})`}
 </p>
 </div>

 {/* Items */}
 <div>
 <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-[var(--text-primary)]">
 <Package size={16} className="text-[var(--color-primary)]" /> Items ({items.length})
 </h3>
 <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
 {items.map((item, i) => (
 <div key={item.id || i} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-surface-secondary)] border border-[var(--border-color)]/40">
 <img src={item.imageUrl || item.productImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=60'}
 alt={item.productName || item.name}
 className="w-11 h-11 rounded-xl object-cover border border-slate-100 bg-white"
 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=60'; }} />
 <div className="flex-1 min-w-0">
 <p className="text-xs font-bold truncate text-[var(--text-primary)]">{item.productName || item.name}</p>
 <p className="text-[10px] text-[var(--text-muted)] font-bold">QTY: {item.quantity}</p>
 </div>
 <span className="text-xs font-black text-[var(--text-primary)]">₹{((item.price || item.sellingPrice || 0) * item.quantity).toFixed(2)}</span>
 </div>
 ))}
 </div>
 </div>

 <div className="flex gap-3 pt-3">
 <button onClick={() => setStep(2)}
 className="px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-black/5">
 <ChevronLeft size={16} /> Back
 </button>
 <motion.button
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 onClick={handlePlaceOrder}
 disabled={placing}
 className="flex-1 py-3.5 rounded-2xl gradient-primary text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
 >
 {placing ? <Loader2 size={16} className="animate-spin" /> : <>Complete Checkout • ₹{total.toFixed(2)}</>}
 </motion.button>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Order Summary Sidebar */}
 <div className="md:col-span-1">
 <div className="rounded-3xl p-5 sticky top-24 glass-card border border-[var(--border-color)]/60 shadow-lg">
 <h3 className="text-xs font-black uppercase tracking-wider mb-4 text-[var(--text-primary)]">
 Order Summary
 </h3>
 <div className="space-y-2.5 text-xs">
 <div className="flex justify-between">
 <span className="text-[var(--text-secondary)] font-medium">Subtotal ({items.length} items)</span>
 <span className="text-[var(--text-primary)] font-bold">₹{subtotal.toFixed(2)}</span>
 </div>
 {discount > 0 && (
 <div className="flex justify-between">
 <span className="text-[var(--text-secondary)] font-medium">Cart Discount</span>
 <span className="text-emerald-600 font-bold">-₹{discount.toFixed(2)}</span>
 </div>
 )}
 <div className="flex justify-between">
 <span className="text-[var(--text-secondary)] font-medium">Shipping Fee</span>
 <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-[var(--text-primary)]'}`}>
 {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
 </span>
 </div>
 <div className="flex justify-between text-sm font-black pt-4 mt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
 <span className="text-[var(--text-primary)] uppercase">Payable Total</span>
 <span className="text-[var(--color-primary)] font-black">₹{total.toFixed(2)}</span>
 </div>
 </div>

 {subtotal < 499 && (
 <p className="text-[10px] text-center mt-4 py-2 px-3 rounded-xl bg-amber-500/10 text-amber-600 font-bold border border-dashed border-amber-500/20">
 Shop for ₹{(499 - subtotal).toFixed(0)} more for FREE delivery
 </p>
 )}

 <div className="mt-5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
 <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
 <Truck size={14} className="animate-bounce" />
 Free 1-2 Days Dispatch
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </PageTransition>
 );
}
