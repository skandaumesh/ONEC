"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 LayoutDashboard, Package, Users, ShoppingCart, DollarSign,
 TrendingUp, Edit3, Trash2, Plus, Search, Check, BarChart3,
 FileText, Star, Sparkles, Download, Layers, ShieldCheck, AlertTriangle,
 Tag, MessageSquare, Calendar, ArrowUpRight, Activity, Percent, X
} from 'lucide-react';
import { adminApi, categoryApi, productApi, discountApi, reviewApi, inventoryApi } from '@/api';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/common';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PIE_COLORS = ['#FF6F61', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

export default function AdminDashboard() {
 const [activeSection, setActiveSection] = useState('overview');
 const [loading, setLoading] = useState(true);
 const { success: showSuccessToast, error: showErrorToast } = useToast();

 // Core Data
 const [stats, setStats] = useState({
 totalProducts: 0,
 totalOrders: 0,
 totalCustomers: 0,
 totalRevenue: 0,
 todayOrders: 0,
 todayRevenue: 0,
 pendingOrders: 0,
 lowStockProducts: 0
 });
 const [products, setProducts] = useState([]);
 const [orders, setOrders] = useState([]);
 const [users, setUsers] = useState([]);
 const [categories, setCategories] = useState([]);
 const [inventory, setInventory] = useState([]);
 const [discounts, setDiscounts] = useState([]);
 const [reviews, setReviews] = useState([]);
 const [reports, setReports] = useState(null);
 const [recommendations, setRecommendations] = useState([]);

 // Modals & Forms States
 const [productModalOpen, setProductModalOpen] = useState(false);
 const [editingProduct, setEditingProduct] = useState(null);
 const [isUploading, setIsUploading] = useState(false);
 const [restockModalOpen, setRestockModalOpen] = useState(false);
 const [restockItem, setRestockItem] = useState(null);
 const [restockQty, setRestockQty] = useState('');
 
 const [discountModalOpen, setDiscountModalOpen] = useState(false);
 const [editingDiscount, setEditingDiscount] = useState(null);

 // Search/Filters
 const [searchTerm, setSearchTerm] = useState('');
 const [statusFilter, setStatusFilter] = useState('');

 // Form Fields
 const [productForm, setProductForm] = useState({
 name: '', description: '', mrp: '', sellingPrice: '',
 manufacturer: '', saltComposition: '', uses: '', sideEffects: '',
 directions: '', imageUrl: '', prescriptionRequired: false,
 featured: false, stock: 0, packSize: '', dosageForm: '', categoryId: ''
 });

 const [discountForm, setDiscountForm] = useState({
 code: '', description: '', discountType: 'PERCENTAGE', discountValue: '',
 minOrderAmount: '0', maxDiscountAmount: '', usageLimit: '',
 validFrom: '', validUntil: '', active: true
 });

 // Analytics Data
 const [analyticsData, setAnalyticsData] = useState({ salesData: [], categoryData: [], topProducts: [] });
 const [analyticsLoading, setAnalyticsLoading] = useState(false);

 useEffect(() => {
 fetchDashboardData();
 if (activeSection === 'analytics') {
 fetchAnalyticsData();
 }
 }, [activeSection]);

 const fetchAnalyticsData = async () => {
 setAnalyticsLoading(true);
 try {
 const res = await fetch('/api/v1/admin/analytics');
 const json = await res.json();
 if (json.success) {
 setAnalyticsData(json.data);
 }
 } catch (e) {
 console.error(e);
 } finally {
 setAnalyticsLoading(false);
 }
 };

 const fetchDashboardData = async () => {
 setLoading(true);
 try {
 await Promise.all([
 loadStats(),
 loadProducts(),
 loadOrders(),
 loadUsers(),
 loadCategories(),
 loadInventory(),
 loadDiscounts(),
 loadReviews(),
 loadSalesReport(),
 loadRecommendations()
 ]);
 } catch (err) {
 console.error(err);
 showErrorToast('Failed to retrieve real-time API values. Initializing fallbacks.');
 } finally {
 setLoading(false);
 }
 };

 // API Callers
 const loadStats = async () => {
 try {
 const res = await adminApi.getDashboard();
 if (res.data?.data) setStats(res.data.data);
 } catch {
 setStats({
 totalProducts: 16, totalOrders: 154, totalCustomers: 42, totalRevenue: 128450.00,
 todayOrders: 5, todayRevenue: 2450.00, pendingOrders: 3, lowStockProducts: 1
 });
 }
 };

 const loadProducts = async () => {
 try {
 const res = await productApi.getAll({ page: 0, size: 100 });
 if (res.data?.data?.content) setProducts(res.data.data.content);
 } catch {
 setProducts([
 { id: 1, name: 'Dolo 650mg Tablet', manufacturer: 'Micro Labs Ltd', mrp: 30, sellingPrice: 25.50, stock: 150, rating: 4.5, active: true },
 { id: 2, name: 'Crocin Advance 500mg', manufacturer: 'GSK Pharma', mrp: 25, sellingPrice: 21.25, stock: 95, rating: 4.3, active: true },
 { id: 4, name: 'Himalaya Liv.52 DS', manufacturer: 'Himalaya Wellness', mrp: 230, sellingPrice: 195.50, stock: 45, rating: 4.6, active: true }
 ]);
 }
 };

 const loadOrders = async () => {
 try {
 const res = await adminApi.getOrders({ page: 0, size: 100 });
 if (res.data?.data?.content) {
 setOrders(res.data.data.content.map(o => ({
 id: o.id, orderNumber: o.orderNumber || `ONEC-${o.id}`,
 customer: `${o.userFirstName || 'Guest'} ${o.userLastName || ''}`.trim(),
 total: o.totalAmount, status: o.status || 'PENDING',
 itemsCount: o.items ? o.items.length : 1, date: o.createdAt?.split('T')[0] || '2026-05-25'
 })));
 }
 } catch {
 setOrders([
 { id: 1, orderNumber: 'ONEC-2026-102', customer: 'Vikas Kumar', total: 640.00, status: 'DELIVERED', itemsCount: 3, date: '2026-05-25' },
 { id: 2, orderNumber: 'ONEC-2026-103', customer: 'Priya Sharma', total: 195.50, status: 'PENDING', itemsCount: 1, date: '2026-05-25' }
 ]);
 }
 };

 const loadUsers = async () => {
 try {
 const res = await adminApi.getUsers();
 if (res.data?.data) setUsers(res.data.data);
 } catch {
 setUsers([
 { id: 1, firstName: 'Admin', lastName: 'ONEC', email: 'admin@onecpharma.com', role: 'ADMIN', enabled: true },
 { id: 2, firstName: 'Rahul', lastName: 'Verma', email: 'rahul@example.com', role: 'CUSTOMER', enabled: true }
 ]);
 }
 };

 const loadCategories = async () => {
 try {
 const res = await categoryApi.getAll();
 if (res.data?.data) setCategories(res.data.data);
 } catch {
 setCategories([{ id: 1, name: 'Medicines' }, { id: 2, name: 'Wellness' }]);
 }
 };

 const loadInventory = async () => {
 try {
 const res = await inventoryApi.getAll();
 if (res.data?.data) setInventory(res.data.data);
 } catch {
 setInventory([
 { id: 1, productId: 1, productName: 'Dolo 650mg Tablet', quantity: 500, reorderLevel: 15, batchNumber: 'BATCH-DOL650A', expiryDate: '2026-06-15', lowStock: false, expiringSoon: true },
 { id: 4, productId: 8, productName: 'Accu-Chek Glucometer', quantity: 8, reorderLevel: 10, batchNumber: 'BATCH-ACCU8D', expiryDate: '2028-12-15', lowStock: true, expiringSoon: false }
 ]);
 }
 };

 const loadDiscounts = async () => {
 try {
 const res = await discountApi.getAll();
 if (res.data?.data) setDiscounts(res.data.data);
 } catch {
 setDiscounts([
 { id: 1, code: 'WELCOME10', description: '10% Off', discountType: 'PERCENTAGE', discountValue: 10, minOrderAmount: 100, validUntil: '2026-12-31', active: true, usedCount: 24 }
 ]);
 }
 };

 const loadReviews = async () => {
 try {
 const res = await reviewApi.getAll();
 if (res.data?.data) setReviews(res.data.data);
 } catch {
 setReviews([
 { id: 1, productName: 'Dolo 650mg Tablet', userName: 'Vikas Kumar', rating: 5, comment: 'Highly effective, prompt delivery!', sentiment: 'POSITIVE', verifiedPurchase: true, createdAt: '2026-05-24' }
 ]);
 }
 };

 const loadSalesReport = async () => {
 try {
 const res = await adminApi.getSalesReport('weekly');
 if (res.data?.data) setReports(res.data.data);
 } catch {
 setReports({
 totalRevenue: 128450.00, totalOrders: 254, averageOrderValue: 505.70,
 dailyRevenue: [
 { date: 'May 19', revenue: 12500, orderCount: 25 },
 { date: 'May 20', revenue: 18400, orderCount: 38 },
 { date: 'May 25', revenue: 31200, orderCount: 61 }
 ],
 topProducts: [
 { productId: 1, productName: 'Premium Vitamin C 1000mg', unitsSold: 420, totalSales: 125580 }
 ],
 categoryBreakdown: [
 { categoryName: 'Medicines', totalSales: 64225, percentage: 50 }
 ]
 });
 }
 };

 const loadRecommendations = async () => {
 try {
 const res = await adminApi.getRecommendations();
 if (res.data?.data) setRecommendations(res.data.data);
 } catch {
 setRecommendations([
 { id: 1, antecedent: 'Dolo 650mg Pain Relief', consequent: 'Premium Vitamin C 1000mg', confidence: 0.85, support: 0.12, status: 'ACTIVE' }
 ]);
 }
 };

 // Actions handlers
 const handleProductSubmit = async (e) => {
 e.preventDefault();
 try {
 if (editingProduct) {
 await adminApi.updateProduct(editingProduct.id, productForm);
 showSuccessToast('Product updated successfully!');
 } else {
 await adminApi.createProduct(productForm);
 showSuccessToast('Product created successfully!');
 }
 setProductModalOpen(false);
 loadProducts();
 } catch {
 showErrorToast('Failed to save product details.');
 }
 };

 const handleImageUpload = async (e) => {
 const file = e.target.files[0];
 if (!file) return;

 setIsUploading(true);
 try {
 const formData = new FormData();
 formData.append('file', file);
 
 const res = await adminApi.uploadImage(formData);
 if (res.data?.success) {
 setProductForm(prev => ({ ...prev, imageUrl: res.data.url }));
 showSuccessToast('Image uploaded successfully');
 }
 } catch (err) {
 console.error(err);
 showErrorToast('Failed to upload image');
 } finally {
 setIsUploading(false);
 }
 };

 const handleProductDelete = async (id) => {
 if (!window.confirm('Delete this medicine from directory?')) return;
 try {
 await adminApi.deleteProduct(id);
 showSuccessToast('Product deleted.');
 loadProducts();
 } catch {
 showErrorToast('Operation failed.');
 }
 };

 const handleStatusChange = async (id, status) => {
 try {
 await adminApi.updateOrderStatus(id, status);
 showSuccessToast(`Order status updated to ${status}`);
 loadOrders();
 } catch {
 showErrorToast('Failed to update status.');
 }
 };

 const handleRestockSubmit = async (e) => {
 e.preventDefault();
 try {
 await inventoryApi.restock(restockItem.productId, parseInt(restockQty));
 showSuccessToast('Restocked successfully!');
 setRestockModalOpen(false);
 loadInventory();
 } catch {
 showErrorToast('Failed to restock product.');
 }
 };

 const handleDiscountSubmit = async (e) => {
 e.preventDefault();
 try {
 if (editingDiscount) {
 await discountApi.update(editingDiscount.id, discountForm);
 showSuccessToast('Coupon updated.');
 } else {
 await discountApi.create(discountForm);
 showSuccessToast('Coupon created.');
 }
 setDiscountModalOpen(false);
 loadDiscounts();
 } catch {
 showErrorToast('Operation failed. Validate fields.');
 }
 };

 const handleDiscountDelete = async (id) => {
 if (!window.confirm('Delete coupon code?')) return;
 try {
 await discountApi.delete(id);
 showSuccessToast('Coupon deleted.');
 loadDiscounts();
 } catch {
 showErrorToast('Operation failed.');
 }
 };

 const handleReviewDelete = async (id) => {
 if (!window.confirm('Remove this review from product pages?')) return;
 try {
 await reviewApi.delete(id);
 showSuccessToast('Review removed.');
 loadReviews();
 } catch {
 showErrorToast('Failed to delete review.');
 }
 };

 const toggleUserEnabled = async (id) => {
 try {
 await adminApi.toggleUserEnabled(id);
 showSuccessToast('User status toggled.');
 loadUsers();
 } catch {
 showErrorToast('Operation failed.');
 }
 };

 // Navigations Lists
 const navigationItems = [
 { id: 'overview', label: 'Overview', icon: LayoutDashboard },
 { id: 'analytics', label: 'Analytics', icon: BarChart3 },
 { id: 'products', label: 'Medicines Directory', icon: Package },
 { id: 'orders', label: 'Orders Desk', icon: ShoppingCart },
 { id: 'users', label: 'Staff & Patients', icon: Users }
 ];

 return (
 <div className="min-h-screen bg-[#F6F9FC] #08111B] flex flex-col md:flex-row text-slate-800 ">
 
 {/* Sidebar Navigation */}
 <aside className="w-full md:w-64 bg-white #0C1E43] border-r border-slate-150 p-5 space-y-1">
 <div className="mb-6 flex items-center gap-2 px-3 py-1">
 <div className="w-8 h-8 rounded-lg bg-[#FF6F61] flex items-center justify-center text-white">
 <LayoutDashboard size={16} />
 </div>
 <div>
 <h2 className="text-sm font-black text-[#102A43] leading-none">ONEC Console</h2>
 <span className="text-[8px] font-bold text-slate-400 tracking-wider">ENTERPRISE SYSTEM</span>
 </div>
 </div>

 {navigationItems.map(item => {
 const Icon = item.icon;
 const isActive = activeSection === item.id;
 return (
 <button
 key={item.id}
 onClick={() => setActiveSection(item.id)}
 className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
 isActive
 ? "bg-[#FFF3F2] #FF6F61]/10 text-[#FF6F61]"
 : "text-slate-600 hover:bg-slate-50"
 }`}
 >
 <Icon size={15} /> {item.label}
 </button>
 );
 })}
 </aside>

 {/* Main Console Content */}
 <main className="flex-1 p-6 md:p-8 max-w-7xl overflow-x-hidden">
 
 {loading ? (
 <div className="min-h-[50vh] flex items-center justify-center flex-col gap-2">
 <Activity className="animate-spin text-[#FF6F61]" size={36} />
 <span className="text-xs font-bold text-slate-400">Loading console streams...</span>
 </div>
 ) : (
 <AnimatePresence mode="wait">
 <motion.div
 key={activeSection}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.2 }}
 >
 
 {/* ================= SECTION: ANALYTICS ================= */}
 {activeSection === 'analytics' && (
 <div className="space-y-6">
 <div className="flex justify-between items-center">
 <div>
 <h2 className="text-xl font-black text-[#102A43]">Real-time Analytics</h2>
 <p className="text-slate-400 text-xs font-bold mt-0.5">Live aggregated insights from your database</p>
 </div>
 <button onClick={fetchAnalyticsData} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50">Refresh</button>
 </div>

 {analyticsLoading ? (
 <div className="min-h-[30vh] flex items-center justify-center flex-col gap-2">
 <Activity className="animate-spin text-[#FF6F61]" size={36} />
 <span className="text-xs font-bold text-slate-400">Loading charts...</span>
 </div>
 ) : (
 <div className="space-y-6">
 {/* Line Chart: Revenue Trend */}
 <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm">
 <h3 className="font-extrabold text-[#102A43] text-sm uppercase mb-4 tracking-wider">7-Day Revenue Trend</h3>
 <div className="h-72 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={analyticsData.salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
 <Line type="monotone" dataKey="revenue" stroke="#FF6F61" strokeWidth={3} dot={{ r: 4, fill: '#FF6F61', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
 <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" vertical={false} />
 <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
 <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
 <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Pie Chart: Categories */}
 <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm">
 <h3 className="font-extrabold text-[#102A43] text-sm uppercase mb-4 tracking-wider">Products by Category</h3>
 <div className="h-64 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={analyticsData.categoryData}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={80}
 paddingAngle={5}
 dataKey="value"
 label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
 labelLine={false}
 >
 {analyticsData.categoryData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
 ))}
 </Pie>
 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
 </PieChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Bar Chart: Top Products */}
 <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm">
 <h3 className="font-extrabold text-[#102A43] text-sm uppercase mb-4 tracking-wider">Top Value Products</h3>
 <div className="h-64 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={analyticsData.topProducts} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} layout="vertical">
 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
 <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
 <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} tickLine={false} axisLine={false} width={100} />
 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 'bold' }} cursor={{fill: '#f8fafc'}} />
 <Bar dataKey="price" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 )}

 {/* ================= SECTION: OVERVIEW ================= */}
 {activeSection === 'overview' && (
 <div className="space-y-6">
 <div className="flex justify-between items-center">
 <div>
 <h2 className="text-xl font-black text-[#102A43] ">Overview Terminal</h2>
 <p className="text-slate-400 text-xs font-bold mt-0.5">Real-time operation counters and key healthcare KPIs</p>
 </div>
 <button onClick={fetchDashboardData} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50">Sync</button>
 </div>

 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label: 'GROSS REVENUE', val: `₹${stats.totalRevenue.toFixed(2)}`, desc: 'Total sales earnings', icon: DollarSign, color: 'text-emerald-500 bg-emerald-50 ' },
 { label: 'OPERATIONAL ORDERS', val: stats.totalOrders, desc: 'Processed client carts', icon: ShoppingCart, color: 'text-blue-500 bg-blue-50 ' },
 { label: 'STAFF & PATIENTS', val: stats.totalCustomers, desc: 'Registered user base', icon: Users, color: 'text-purple-500 bg-purple-50 ' },
 { label: 'LOW STOCK MEDS', val: stats.lowStockProducts, desc: 'Below reorder threshold', icon: AlertTriangle, color: 'text-[#FF6F61] bg-[#FFF3F2] #FF6F61]/10' }
 ].map((card, i) => {
 const Icon = card.icon;
 return (
 <div key={i} className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl flex items-center justify-between">
 <div>
 <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">{card.label}</span>
 <h3 className="text-xl font-black text-[#102A43] mt-1">{card.val}</h3>
 <p className="text-[10px] text-slate-400 mt-1 font-semibold">{card.desc}</p>
 </div>
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
 <Icon size={16} />
 </div>
 </div>
 );
 })}
 </div>

 {/* Operational Lists */}
 <div className="grid lg:grid-cols-3 gap-6">
 <div className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl lg:col-span-2">
 <h4 className="font-extrabold text-[#102A43] text-xs uppercase mb-4 tracking-wider">Recent Dispatched Orders</h4>
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="text-slate-400 border-b border-slate-100 pb-2">
 <th className="pb-2">Order ID</th>
 <th className="pb-2">Patient</th>
 <th className="pb-2">Items</th>
 <th className="pb-2">Amount</th>
 <th className="pb-2">Status</th>
 </tr>
 </thead>
 <tbody>
 {orders.slice(0, 5).map(o => (
 <tr key={o.id} className="border-b border-slate-50 ">
 <td className="py-2.5 font-bold font-mono">{o.orderNumber}</td>
 <td className="py-2.5 font-semibold">{o.customer}</td>
 <td className="py-2.5">{o.itemsCount}</td>
 <td className="py-2.5 font-bold text-[#FF6F61]">₹{o.total?.toFixed(2)}</td>
 <td className="py-2.5">
 <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
 o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
 }`}>{o.status}</span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 <div className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl">
 <h4 className="font-extrabold text-[#102A43] text-xs uppercase mb-4 tracking-wider font-sans">Active Coupons Status</h4>
 <div className="space-y-3">
 {discounts.map(d => (
 <div key={d.id} className="flex justify-between items-center p-3 bg-slate-50 #122A5E]/40 border border-slate-100 rounded-xl">
 <div>
 <div className="font-mono font-black text-[#FF6F61] text-xs">{d.code}</div>
 <span className="text-[9px] font-bold text-slate-400">Used {d.usedCount} times</span>
 </div>
 <span className="text-xs font-black text-slate-700 ">
 {d.discountType === 'PERCENTAGE' ? `${d.discountValue}% OFF` : `₹${d.discountValue} FLAT`}
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ================= SECTION: MEDICINES DIRECTORY ================= */}
 {activeSection === 'products' && (
 <div className="space-y-6">
 <div className="flex justify-between items-center flex-wrap gap-4">
 <div>
 <h2 className="text-xl font-black text-[#102A43] ">Medicines Directory</h2>
 <p className="text-slate-400 text-xs font-bold mt-0.5">Manage pharmaceuticals inventory database sheets</p>
 </div>
 <button
 onClick={() => {
 setEditingProduct(null);
 setProductForm({
 name: '', description: '', mrp: '', sellingPrice: '',
 manufacturer: '', saltComposition: '', uses: '', sideEffects: '',
 directions: '', imageUrl: '', prescriptionRequired: false,
 featured: false, stock: 0, packSize: '', dosageForm: '', categoryId: categories[0]?.id || ''
 });
 setProductModalOpen(true);
 }}
 className="bg-[#FF6F61] hover:bg-[#E05A4D] border-none text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer flex items-center gap-1.5"
 >
 <Plus size={14} /> Add Medicine
 </button>
 </div>

 {/* Medicines Listing Table */}
 <div className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="text-slate-400 border-b border-slate-100 pb-2">
 <th className="pb-2">ID</th>
 <th className="pb-2">Medicine Brand Name</th>
 <th className="pb-2">Manufacturer</th>
 <th className="pb-2">Selling Price</th>
 <th className="pb-2">Stock Level</th>
 <th className="pb-2">Actions</th>
 </tr>
 </thead>
 <tbody>
 {products.map(p => (
 <tr key={p.id} className="border-b border-slate-50 ">
 <td className="py-3 font-mono text-slate-400">{p.id}</td>
 <td className="py-3">
 <div className="font-extrabold text-[#102A43] ">{p.name}</div>
 </td>
 <td className="py-3 font-semibold text-slate-500 ">{p.manufacturer}</td>
 <td className="py-3 font-bold text-slate-700 ">₹{p.sellingPrice?.toFixed(2)}</td>
 <td className="py-3">
 <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
 p.stock <= 10 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600 '
 }`}>{p.stock} units</span>
 </td>
 <td className="py-3 flex gap-2">
 <button
 onClick={() => {
 setEditingProduct(p);
 setProductForm({
 name: p.name, description: p.description || '', mrp: p.mrp || '',
 sellingPrice: p.sellingPrice || '', manufacturer: p.manufacturer || '',
 saltComposition: p.saltComposition || '', uses: p.uses || '',
 sideEffects: p.sideEffects || '', directions: p.directions || '',
 imageUrl: p.imageUrl || '', prescriptionRequired: p.prescriptionRequired || false,
 featured: p.featured || false, stock: p.stock || 0,
 packSize: p.packSize || '', dosageForm: p.dosageForm || '',
 categoryId: p.categoryId || categories[0]?.id || ''
 });
 setProductModalOpen(true);
 }}
 className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer"
 >
 <Edit3 size={13} />
 </button>
 <button
 onClick={() => handleProductDelete(p.id)}
 className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
 >
 <Trash2 size={13} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}

 {/* ================= SECTION: ORDERS DESK ================= */}
 {activeSection === 'orders' && (
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-black text-[#102A43] ">Orders Desk</h2>
 <p className="text-slate-400 text-xs font-bold mt-0.5">Manage operational dispatches, verify prescription approvals, update statuses</p>
 </div>

 <div className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="text-slate-400 border-b border-slate-100 pb-2">
 <th className="pb-2">Order No</th>
 <th className="pb-2">Date</th>
 <th className="pb-2">Patient</th>
 <th className="pb-2">Items</th>
 <th className="pb-2">Total Amount</th>
 <th className="pb-2">Operational Status</th>
 </tr>
 </thead>
 <tbody>
 {orders.map(o => (
 <tr key={o.id} className="border-b border-slate-50 ">
 <td className="py-3 font-mono font-bold">{o.orderNumber}</td>
 <td className="py-3 text-slate-500">{o.date}</td>
 <td className="py-3 font-semibold">{o.customer}</td>
 <td className="py-3">{o.itemsCount} meds</td>
 <td className="py-3 font-black text-[#FF6F61]">₹{o.total?.toFixed(2)}</td>
 <td className="py-3">
 <select
 value={o.status}
 onChange={(e) => handleStatusChange(o.id, e.target.value)}
 className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-bold cursor-pointer"
 >
 {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(st => (
 <option key={st} value={st}>{st}</option>
 ))}
 </select>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}

 {/* ================= SECTION: EXPIRY & BATCHES ================= */}
 {activeSection === 'inventory' && (
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-black text-[#102A43] ">Expiry & Batches Desk</h2>
 <p className="text-slate-400 text-xs font-bold mt-0.5">Automated batch control, expiry dates warnings, low stock flags</p>
 </div>

 <div className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="text-slate-400 border-b border-slate-100 pb-2">
 <th className="pb-2">Batch No</th>
 <th className="pb-2">Medicine Brand Name</th>
 <th className="pb-2">Stock Level</th>
 <th className="pb-2">Expiry Date</th>
 <th className="pb-2">Alert Indicators</th>
 <th className="pb-2">Actions</th>
 </tr>
 </thead>
 <tbody>
 {inventory.map(inv => (
 <tr key={inv.id} className="border-b border-slate-50 ">
 <td className="py-3 font-mono font-bold text-slate-500">{inv.batchNumber}</td>
 <td className="py-3 font-extrabold text-[#102A43] ">{inv.productName}</td>
 <td className="py-3">
 <span className={`font-bold ${inv.lowStock ? 'text-red-500' : 'text-slate-650 '}`}>{inv.quantity} units</span>
 </td>
 <td className="py-3 font-semibold text-slate-500">{inv.expiryDate}</td>
 <td className="py-3">
 {inv.lowStock && (
 <span className="bg-red-50 text-red-600 text-[9px] font-black px-2 py-0.5 rounded mr-1.5 uppercase">LOW STOCK</span>
 )}
 {inv.expiringSoon && (
 <span className="bg-amber-50 text-amber-600 text-[9px] font-black px-2 py-0.5 rounded uppercase">EXPIRING SOON</span>
 )}
 {!inv.lowStock && !inv.expiringSoon && (
 <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded uppercase">HEALTHY</span>
 )}
 </td>
 <td className="py-3">
 <button
 onClick={() => {
 setRestockItem(inv);
 setRestockQty('');
 setRestockModalOpen(true);
 }}
 className="px-3 py-1.5 bg-[#FF6F61] text-white text-[10px] font-bold rounded-lg cursor-pointer"
 >
 Restock
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}

 {/* ================= SECTION: COUPONS ENGINE ================= */}
 {activeSection === 'discounts' && (
 <div className="space-y-6">
 <div className="flex justify-between items-center">
 <div>
 <h2 className="text-xl font-black text-[#102A43] ">Coupons & Discounts Engine</h2>
 <p className="text-slate-400 text-xs font-bold mt-0.5">Configure campaign vouchers and checkout flat/percentage coupons</p>
 </div>
 <button
 onClick={() => {
 setEditingDiscount(null);
 setDiscountForm({
 code: '', description: '', discountType: 'PERCENTAGE', discountValue: '',
 minOrderAmount: '0', maxDiscountAmount: '', usageLimit: '',
 validFrom: '', validUntil: '', active: true
 });
 setDiscountModalOpen(true);
 }}
 className="bg-[#FF6F61] hover:bg-[#E05A4D] border-none text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer flex items-center gap-1.5"
 >
 <Plus size={14} /> New Coupon
 </button>
 </div>

 <div className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="text-slate-400 border-b border-slate-100 pb-2">
 <th className="pb-2">Promo Code</th>
 <th className="pb-2">Discount Value</th>
 <th className="pb-2">Valid Until</th>
 <th className="pb-2">Uses Limit</th>
 <th className="pb-2">Uses Count</th>
 <th className="pb-2">Actions</th>
 </tr>
 </thead>
 <tbody>
 {discounts.map(disc => (
 <tr key={disc.id} className="border-b border-slate-50 ">
 <td className="py-3">
 <span className="font-mono font-black text-[#FF6F61] bg-[#FFF3F2] px-2.5 py-1 rounded border border-[#FF6F61]/10 text-xs">{disc.code}</span>
 </td>
 <td className="py-3 font-extrabold text-slate-800 ">
 {disc.discountType === 'PERCENTAGE' ? `${disc.discountValue}% OFF` : `₹${disc.discountValue} FLAT`}
 </td>
 <td className="py-3 text-slate-550 font-semibold">{disc.validUntil}</td>
 <td className="py-3">{disc.usageLimit || 'UNLIMITED'}</td>
 <td className="py-3 font-bold text-slate-400">{disc.usedCount} used</td>
 <td className="py-3 flex gap-2">
 <button
 onClick={() => {
 setEditingDiscount(disc);
 setDiscountForm({
 code: disc.code, description: disc.description || '',
 discountType: disc.discountType, discountValue: disc.discountValue,
 minOrderAmount: disc.minOrderAmount || '0',
 maxDiscountAmount: disc.maxDiscountAmount || '',
 usageLimit: disc.usageLimit || '',
 validFrom: disc.validFrom || '',
 validUntil: disc.validUntil || '',
 active: disc.active
 });
 setDiscountModalOpen(true);
 }}
 className="p-1 text-blue-500 hover:bg-blue-50 rounded cursor-pointer"
 >
 <Edit3 size={13} />
 </button>
 <button
 onClick={() => handleDiscountDelete(disc.id)}
 className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
 >
 <Trash2 size={13} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}

 {/* ================= SECTION: STAFF & PATIENTS ================= */}
 {activeSection === 'users' && (
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-black text-[#102A43] ">Staff & Patients Registry</h2>
 <p className="text-slate-400 text-xs font-bold mt-0.5">Toggle enable/disable toggles, modify access permissions roles</p>
 </div>

 <div className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="text-slate-400 border-b border-slate-100 pb-2">
 <th className="pb-2">User ID</th>
 <th className="pb-2">Name</th>
 <th className="pb-2">Email Address</th>
 <th className="pb-2">Phone</th>
 <th className="pb-2">Security Role</th>
 <th className="pb-2">Actions</th>
 </tr>
 </thead>
 <tbody>
 {users.map(u => (
 <tr key={u.id} className="border-b border-slate-50 ">
 <td className="py-3 font-mono text-slate-400">{u.id}</td>
 <td className="py-3 font-extrabold text-[#102A43] ">{u.firstName} {u.lastName}</td>
 <td className="py-3 font-semibold text-slate-500">{u.email}</td>
 <td className="py-3">{u.phone || '—'}</td>
 <td className="py-3">
 <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide ${
 u.role === 'ADMIN' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-650'
 }`}>{u.role}</span>
 </td>
 <td className="py-3">
 <button
 onClick={() => toggleUserEnabled(u.id)}
 className={`px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
 u.enabled ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
 }`}
 >
 {u.enabled ? 'Disable' : 'Enable'}
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}

 {/* ================= SECTION: SALES INTELLIGENCE ================= */}
 {activeSection === 'reports' && reports && (
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-black text-[#102A43] ">Sales Intelligence Dashboard</h2>
 <p className="text-slate-400 text-xs font-bold mt-0.5">Aggregated metrics, daily revenues, top products breakdown</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {[
 { label: 'GROSS INCOME REVENUE', val: `₹${reports.totalRevenue?.toFixed(2)}`, desc: 'Overall accumulated sales' },
 { label: 'TOTAL CAMPAIGNS ORDERS', val: reports.totalOrders, desc: 'Operational checkout count' },
 { label: 'AVERAGE TICKET BASKET', val: `₹${reports.averageOrderValue?.toFixed(2)}`, desc: 'Average order value size' }
 ].map((rep, idx) => (
 <div key={idx} className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl">
 <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">{rep.label}</span>
 <h3 className="text-xl font-black text-[#FF6F61] mt-1">{rep.val}</h3>
 <p className="text-[10px] text-slate-400 mt-1 font-semibold">{rep.desc}</p>
 </div>
 ))}
 </div>

 <div className="grid lg:grid-cols-2 gap-6">
 {/* Daily Revenue Trends */}
 <div className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl">
 <h4 className="font-extrabold text-xs uppercase mb-4 text-[#102A43] tracking-wider">Revenue Stream Graph</h4>
 <div className="space-y-3.5">
 {reports.dailyRevenue.map((d, i) => (
 <div key={i} className="flex justify-between items-center">
 <span className="text-xs font-bold text-slate-500">{d.date}</span>
 <div className="flex-1 mx-4 h-2 bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-[#FF6F61]" style={{ width: `${(d.revenue / 40000) * 100}%` }} />
 </div>
 <span className="text-xs font-black text-slate-700 ">₹{d.revenue} ({d.orderCount} orders)</span>
 </div>
 ))}
 </div>
 </div>

 {/* Top Selling Products */}
 <div className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl">
 <h4 className="font-extrabold text-xs uppercase mb-4 text-[#102A43] tracking-wider">Top Performing SKUs</h4>
 <div className="space-y-4">
 {reports.topProducts.map((p, idx) => (
 <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 #122A5E]/40 border border-slate-100 rounded-xl">
 <div>
 <div className="font-extrabold text-xs text-[#102A43] ">{p.productName}</div>
 <span className="text-[9px] font-bold text-slate-400">{p.unitsSold} units shipped</span>
 </div>
 <span className="text-xs font-black text-[#FF6F61]">₹{p.totalSales}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ================= SECTION: REVIEWS DESK ================= */}
 {activeSection === 'reviews' && (
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-black text-[#102A43] ">Customer Feedback Moderation</h2>
 <p className="text-slate-400 text-xs font-bold mt-0.5">Delete negative reviews, verify purchase logs sentiment</p>
 </div>

 <div className="grid grid-cols-1 gap-4">
 {reviews.map(rev => (
 <div key={rev.id} className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl relative flex justify-between gap-6">
 <div>
 <div className="flex items-center gap-3">
 <span className="text-xs font-black text-[#102A43] ">{rev.userName}</span>
 <div className="flex gap-0.5">
 {Array.from({ length: 5 }).map((_, i) => (
 <Star key={i} size={11} className={i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
 ))}
 </div>
 <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
 rev.sentiment === 'POSITIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
 }`}>{rev.sentiment}</span>
 </div>
 
 <h4 className="font-bold text-slate-650 text-xs mt-1.5">{rev.productName}</h4>
 <p className="text-slate-500 text-xs leading-relaxed mt-2 font-semibold italic">"{rev.comment}"</p>
 <span className="text-[9px] text-slate-400 font-bold block mt-3">Posted on {rev.createdAt}</span>
 </div>

 <button
 onClick={() => handleReviewDelete(rev.id)}
 className="px-3.5 py-1.5 border border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700 text-xs font-bold rounded-xl transition-all h-fit cursor-pointer align-self-center shrink-0"
 >
 Moderate Delete
 </button>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* ================= SECTION: AI HEALTH MODELS ================= */}
 {activeSection === 'recommendations' && (
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-black text-[#102A43] ">AI Health Recommendations Engine</h2>
 <p className="text-slate-400 text-xs font-bold mt-0.5">Co-occurrence medicine rules and association basket monitoring</p>
 </div>

 <div className="bg-white #0C1E43] border border-slate-150 p-5 rounded-2xl">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="text-slate-400 border-b border-slate-100 pb-2">
 <th className="pb-2">Rule Antecedent (Meds A)</th>
 <th className="pb-2">Rule Consequent (Meds B)</th>
 <th className="pb-2">Association Support</th>
 <th className="pb-2">Association Confidence</th>
 <th className="pb-2">Model Status</th>
 </tr>
 </thead>
 <tbody>
 {recommendations.map(rec => (
 <tr key={rec.id} className="border-b border-slate-50 ">
 <td className="py-3 font-extrabold text-[#102A43] ">{rec.antecedent}</td>
 <td className="py-3 font-extrabold text-[#FF6F61]">{rec.consequent}</td>
 <td className="py-3 font-bold text-slate-500">{(rec.support * 100).toFixed(0)}% Lift</td>
 <td className="py-3">
 <div className="flex items-center gap-1.5">
 <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-emerald-500" style={{ width: `${rec.confidence * 100}%` }} />
 </div>
 <span className="font-extrabold text-slate-700 ">{(rec.confidence * 100).toFixed(0)}% Match</span>
 </div>
 </td>
 <td className="py-3">
 <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded uppercase">{rec.status}</span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}

 </motion.div>
 </AnimatePresence>
 )}

 </main>

 {/* ================= MODAL: MEDICINE DRAWER ================= */}
 {productModalOpen && (
 <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
 <div className="bg-white #0C1E43] rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative">
 <button onClick={() => setProductModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer">
 <X size={18} />
 </button>

 <h3 className="text-base font-extrabold text-[#102A43] mb-4">
 {editingProduct ? 'Edit Medicine Directory Entry' : 'Create New Medicine Profile'}
 </h3>

 <form onSubmit={handleProductSubmit} className="space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Medicine Name</label>
 <input
 type="text" required value={productForm.name}
 onChange={(e) => setProductForm({...productForm, name: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Manufacturer</label>
 <input
 type="text" required value={productForm.manufacturer}
 onChange={(e) => setProductForm({...productForm, manufacturer: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">MRP Price (₹)</label>
 <input
 type="number" step="0.01" required value={productForm.mrp}
 onChange={(e) => setProductForm({...productForm, mrp: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Selling Price (₹)</label>
 <input
 type="number" step="0.01" required value={productForm.sellingPrice}
 onChange={(e) => setProductForm({...productForm, sellingPrice: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Dosage Form</label>
 <input
 type="text" placeholder="Tablet, Syrup, etc." value={productForm.dosageForm}
 onChange={(e) => setProductForm({...productForm, dosageForm: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Pack Sizing</label>
 <input
 type="text" placeholder="Strip of 15 tablets" value={productForm.packSize}
 onChange={(e) => setProductForm({...productForm, packSize: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>
 </div>

 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Medicine Image (Upload)</label>
 <div className="flex flex-col gap-2">
 <input
 type="file"
 accept="image/*"
 onChange={handleImageUpload}
 disabled={isUploading}
 className="form-input text-xs font-semibold file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#FF6F61]/10 file:text-[#FF6F61] hover:file:bg-[#FF6F61]/20 cursor-pointer"
 />
 {isUploading && <span className="text-[10px] text-blue-500 font-bold">Uploading image...</span>}
 {productForm.imageUrl && !isUploading && (
 <div className="mt-2 border border-slate-200 rounded-lg p-2 bg-slate-50 w-fit">
 <img src={productForm.imageUrl} alt="Preview" className="h-16 object-contain rounded" />
 </div>
 )}
 </div>
 </div>

 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Acidity Composition / Salt Composition</label>
 <input
 type="text" value={productForm.saltComposition}
 onChange={(e) => setProductForm({...productForm, saltComposition: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>

 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Clinical Description</label>
 <textarea
 value={productForm.description}
 onChange={(e) => setProductForm({...productForm, description: e.target.value})}
 className="form-input text-xs font-semibold h-16 resize-none"
 />
 </div>

 <div className="flex gap-4">
 <label className="flex items-center gap-2 text-xs font-bold text-slate-650 cursor-pointer">
 <input
 type="checkbox" checked={productForm.prescriptionRequired}
 onChange={(e) => setProductForm({...productForm, prescriptionRequired: e.target.checked})}
 className="cursor-pointer"
 /> Rx Prescription Required
 </label>
 <label className="flex items-center gap-2 text-xs font-bold text-slate-650 cursor-pointer">
 <input
 type="checkbox" checked={productForm.featured}
 onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
 className="cursor-pointer"
 /> Feature on Homepage
 </label>
 </div>

 <Button
 variant="primary" type="submit"
 className="w-full bg-[#FF6F61] border-none text-white font-bold hover:bg-[#E05A4D] py-3 rounded-xl mt-2"
 >
 Save Operational Changes
 </Button>
 </form>
 </div>
 </div>
 )}

 {/* ================= MODAL: DISCOUNTS DRAWER ================= */}
 {discountModalOpen && (
 <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
 <div className="bg-white #0C1E43] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
 <button onClick={() => setDiscountModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer">
 <X size={18} />
 </button>

 <h3 className="text-base font-extrabold text-[#102A43] mb-4">
 {editingDiscount ? 'Configure Coupon Properties' : 'Deploy Campaign Voucher'}
 </h3>

 <form onSubmit={handleDiscountSubmit} className="space-y-4">
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Voucher Promo Code</label>
 <input
 type="text" required placeholder="WELCOME15" value={discountForm.code}
 onChange={(e) => setDiscountForm({...discountForm, code: e.target.value})}
 className="form-input text-xs font-mono font-black uppercase text-[#FF6F61]"
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Discount Type</label>
 <select
 value={discountForm.discountType}
 onChange={(e) => setDiscountForm({...discountForm, discountType: e.target.value})}
 className="form-input text-xs font-bold"
 >
 <option value="PERCENTAGE">PERCENTAGE (%)</option>
 <option value="FLAT">FLAT (₹)</option>
 </select>
 </div>
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Discount Value</label>
 <input
 type="number" required value={discountForm.discountValue}
 onChange={(e) => setDiscountForm({...discountForm, discountValue: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Min Order Amt (₹)</label>
 <input
 type="number" value={discountForm.minOrderAmount}
 onChange={(e) => setDiscountForm({...discountForm, minOrderAmount: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Voucher Cap Limit</label>
 <input
 type="number" placeholder="Voucher Cap" value={discountForm.usageLimit}
 onChange={(e) => setDiscountForm({...discountForm, usageLimit: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Valid From</label>
 <input
 type="date" required value={discountForm.validFrom}
 onChange={(e) => setDiscountForm({...discountForm, validFrom: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Valid Until</label>
 <input
 type="date" required value={discountForm.validUntil}
 onChange={(e) => setDiscountForm({...discountForm, validUntil: e.target.value})}
 className="form-input text-xs font-semibold"
 />
 </div>
 </div>

 <Button
 variant="primary" type="submit"
 className="w-full bg-[#FF6F61] border-none text-white font-bold hover:bg-[#E05A4D] py-3 rounded-xl mt-2"
 >
 Deploy Voucher Code
 </Button>
 </form>
 </div>
 </div>
 )}

 {/* ================= MODAL: RESTOCK QUANTITY ================= */}
 {restockModalOpen && (
 <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
 <div className="bg-white #0C1E43] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
 <button onClick={() => setRestockModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer">
 <X size={18} />
 </button>

 <h3 className="text-sm font-extrabold text-[#102A43] mb-2">Restock Product Quantity</h3>
 <p className="text-slate-400 text-[11px] font-bold mb-4 uppercase leading-relaxed">{restockItem?.productName}</p>

 <form onSubmit={handleRestockSubmit} className="space-y-4">
 <div className="form-group">
 <label className="form-label text-slate-400 text-[10px] font-bold uppercase">Restock Units Amount</label>
 <input
 type="number" required placeholder="50" min="1" value={restockQty}
 onChange={(e) => setRestockQty(e.target.value)}
 className="form-input text-xs font-bold"
 />
 </div>

 <Button
 variant="primary" type="submit"
 className="w-full bg-[#FF6F61] border-none text-white font-bold hover:bg-[#E05A4D] py-2.5 rounded-xl shadow"
 >
 Confirm Restocking Dispatch
 </Button>
 </form>
 </div>
 </div>
 )}

 </div>
 );
}
