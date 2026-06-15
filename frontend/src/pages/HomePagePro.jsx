import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Pill, Truck, Shield, HeartHandshake, Search,
 ArrowRight, Zap, Phone, Plus, ChevronRight, HelpCircle, Star
} from 'lucide-react';
import { SkeletonCard } from '../components/common/LoadingStates';
import { productApi } from '../api';

/* ─── Static Data ─── */
const FALLBACK_PRODUCTS = [
 { id: 1, name: 'Premium Vitamin C 1000mg', category: 'Vitamins & Supplements', price: 299, originalPrice: 499, discount: 40, rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300', manufacturer: 'GSK Pharma', packSize: 'Bottle of 60 tablets' },
 { id: 2, name: 'Advanced Pain Relief Tablet', category: 'Pain Management', price: 45, originalPrice: 75, discount: 40, rating: 4.6, reviews: 189, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300', manufacturer: 'Micro Labs Ltd', packSize: 'Strip of 15 tablets' },
 { id: 3, name: 'Herbal Sleep Wellness', category: 'Wellness', price: 399, originalPrice: 599, discount: 33, rating: 4.9, reviews: 342, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300', manufacturer: 'Himalaya Wellness', packSize: 'Bottle of 60 tablets' },
 { id: 4, name: 'Immune Booster Supplement', category: 'Immune Support', price: 599, originalPrice: 899, discount: 33, rating: 4.7, reviews: 256, image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300', manufacturer: 'Abbott Healthcare', packSize: 'Bottle of 30 tablets' },
 { id: 5, name: 'Skin Care Derma Cream', category: 'Skincare', price: 349, originalPrice: 549, discount: 36, rating: 4.5, reviews: 178, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300', manufacturer: 'Neutrogena', packSize: '50ml Tube' },
 { id: 6, name: 'Multivitamin Daily Tablet', category: 'Vitamins', price: 249, originalPrice: 449, discount: 44, rating: 4.8, reviews: 412, image: 'https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=300', manufacturer: 'Pfizer Ltd', packSize: 'Strip of 30 tablets' }
];

const CONCERNS = [
 { title: 'Diabetes Care', query: 'Diabetes', img: 'https://images.unsplash.com/photo-1505575967455-40e256f7377c?w=150' },
 { title: 'Heart Health', query: 'Cardiac', img: 'https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=150' },
 { title: 'Pain Relief', query: 'Pain', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150' },
 { title: 'Stomach Care', query: 'Digestive', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=150' },
 { title: 'Liver Care', query: 'Liver', img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=150' },
 { title: 'Bone & Joints', query: 'Calcium', img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150' }
];

const SYMPTOMS = [
 { symptom: 'Cold & Cough', products: ['Cough Syrup', 'Throat Lozenges', 'Vitamin C'], color: 'bg-blue-50 border-blue-100 ', text: 'text-blue-700 ', tag: 'bg-blue-100 text-blue-600 ' },
 { symptom: 'Headache & Fever', products: ['Paracetamol', 'Ibuprofen'], color: 'bg-amber-50 border-amber-100 ', text: 'text-amber-700 ', tag: 'bg-amber-100 text-amber-600 ' },
 { symptom: 'Digestion Issues', products: ['Antacid', 'Probiotics'], color: 'bg-emerald-50 border-emerald-100 ', text: 'text-emerald-700 ', tag: 'bg-emerald-100 text-emerald-600 ' },
 { symptom: 'Sleep Problems', products: ['Melatonin', 'Herbal Sleep'], color: 'bg-violet-50 border-violet-100 ', text: 'text-violet-700 ', tag: 'bg-violet-100 text-violet-600 ' },
 { symptom: 'Joint Pain', products: ['Calcium Tablets', 'Pain Gel'], color: 'bg-rose-50 border-rose-100 ', text: 'text-rose-700 ', tag: 'bg-rose-100 text-rose-600 ' },
 { symptom: 'Skin Care', products: ['Face Cream', 'Moisturizer'], color: 'bg-pink-50 border-pink-100 ', text: 'text-pink-700 ', tag: 'bg-pink-100 text-pink-600 ' },
];

const FAQS = [
 { q: 'How do I upload a prescription and order medicines?', a: 'Click the "Upload Prescription" option, select your prescription image, and submit. Our pharmacist will review it and prepare your order for delivery.' },
 { q: 'Are the medicines sold on ONEC Pharma authentic?', a: 'Yes, 100% of products are sourced directly from FDA-approved manufacturers and licensed pharmacy partners. Each package includes batch number and expiry validation.' },
 { q: 'How does home sample collection for lab tests work?', a: 'Book a lab test, and a certified phlebotomist will visit your address at your chosen time slot. Reports are uploaded to your profile within 12-24 hours.' }
];

const TRUST_FEATURES = [
 { icon: Zap, label: 'Fast Delivery', desc: 'Orders in 30 mins' },
 { icon: Shield, label: '100% Authentic', desc: 'Verified medicines' },
 { icon: Truck, label: 'Free Shipping', desc: 'On orders ₹499+' },
 { icon: HeartHandshake, label: '24/7 Support', desc: 'Expert pharmacists' },
];

/* ─── Component ─── */
const HomePage = () => {
 const navigate = useNavigate();
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(false);
 const [faqOpen, setFaqOpen] = useState(null);
 const [searchQuery, setSearchQuery] = useState('');

 const handleSearch = (e) => {
 e.preventDefault();
 if (searchQuery.trim()) {
 navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
 setSearchQuery('');
 }
 };

 useEffect(() => {
 const fetchProducts = async () => {
 setLoading(true);
 try {
 const response = await productApi.getFeatured();
 const apiProducts = response.data.data;
 if (apiProducts?.length > 0) {
 setProducts(apiProducts.map(p => ({
 id: p.id, name: p.name, category: p.categoryName || 'General',
 price: Number(p.sellingPrice), originalPrice: Number(p.mrp),
 discount: Math.round(p.discountPercent || 0), rating: p.rating || 0,
 reviews: p.reviewCount || 0,
 image: p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300',
 manufacturer: p.manufacturer || 'General Pharma', packSize: p.packSize || 'Strip of 10 tablets'
 })));
 } else {
 setProducts(FALLBACK_PRODUCTS);
 }
 } catch {
 setProducts(FALLBACK_PRODUCTS);
 } finally {
 setLoading(false);
 }
 };
 fetchProducts();
 }, []);

 return (
 <div className="w-full min-h-screen bg-slate-50 text-slate-800 ">

 {/* ─── HERO SECTION ─── */}
 <section className="relative overflow-hidden border-b border-slate-100 ">
 <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
 <motion.h1
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-5"
 >
 Your Health, <br />
 <span className="text-[var(--color-primary)]">Delivered Instantly.</span>
 </motion.h1>

 <motion.p
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.1 }}
 className="text-slate-500 text-base md:text-lg font-medium max-w-xl mx-auto mb-10 leading-relaxed"
 >
 Order prescription medicines, wellness essentials, or book lab diagnostic checkups from India's most trusted healthcare partner.
 </motion.p>

 {/* Search Bar */}
 <motion.div
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.2 }}
 className="max-w-xl mx-auto mb-14"
 >
 <form onSubmit={handleSearch} className="relative">
 <div className="flex items-center bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 p-1.5">
 <Search size={18} className="text-slate-400 ml-3.5 shrink-0" />
 <input
 type="text"
 placeholder="Search medicines by name, composition, or symptom..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder-slate-400 py-2.5 px-3"
 />
 <button
 type="submit"
 className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[var(--color-primary-dark)] transition-colors duration-200 shrink-0 cursor-pointer"
 >
 Search
 </button>
 </div>
 </form>
 </motion.div>

 {/* Trust Strip */}
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.3 }}
 className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
 >
 {TRUST_FEATURES.map((feat, i) => {
 const Icon = feat.icon;
 return (
 <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm">
 <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
 <Icon size={18} className="text-[var(--color-primary)]" />
 </div>
 <div className="text-left">
 <p className="text-sm font-bold text-slate-800 leading-tight">{feat.label}</p>
 <p className="text-xs text-slate-400 font-medium">{feat.desc}</p>
 </div>
 </div>
 );
 })}
 </motion.div>
 </div>
 </section>

 {/* ─── SYMPTOM FINDER ─── */}
 <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
 <div className="mb-8">
 <h2 className="text-2xl font-black text-slate-900 mb-2">
 Feeling Under the Weather?
 </h2>
 <p className="text-slate-500 text-sm font-medium">
 Tap a symptom to find recommended remedies
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
 {SYMPTOMS.map((item, idx) => (
 <motion.button
 key={idx}
 onClick={() => navigate(`/products?search=${encodeURIComponent(item.symptom)}`)}
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.05 }}
 whileHover={{ y: -4 }}
 className={`group relative ${item.color} border rounded-2xl p-5 text-left cursor-pointer hover:shadow-md transition-all duration-200`}
 >
 <h3 className={`text-base font-bold ${item.text} mb-2`}>
 {item.symptom}
 </h3>
 <div className="flex flex-wrap gap-1.5">
 {item.products.map((product, i) => (
 <span key={i} className={`text-xs font-semibold ${item.tag} px-2.5 py-1 rounded-full`}>
 {product}
 </span>
 ))}
 </div>
 <ArrowRight size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 ${item.text} opacity-0 group-hover:opacity-70 transition-opacity`} />
 </motion.button>
 ))}
 </div>

 <div className="mt-8 text-center">
 <button
 onClick={() => navigate('/products')}
 className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold text-sm rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors duration-200 shadow-sm hover:shadow-md"
 >
 Explore All Products <ArrowRight size={16} />
 </button>
 </div>
 </section>

 {/* ─── TRUST STRIP (middle) ─── */}
 <section className="w-full bg-[var(--color-primary)] ">
 <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {TRUST_FEATURES.map((feat, i) => {
 const Icon = feat.icon;
 return (
 <motion.div
 key={i}
 initial={{ opacity: 0, y: 10 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.07 }}
 className="flex items-center gap-3"
 >
 <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
 <Icon size={20} className="text-white" />
 </div>
 <div>
 <p className="text-sm font-bold text-white leading-tight">{feat.label}</p>
 <p className="text-xs text-white/75 font-medium">{feat.desc}</p>
 </div>
 </motion.div>
 );
 })}
 </div>
 </div>
 </section>

 {/* ─── HEALTH CONCERNS ─── */}
 <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 border-t border-slate-100 ">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h2 className="text-xl font-black text-slate-900 ">Health Concerns & Solutions</h2>
 <p className="text-slate-400 text-sm font-medium mt-1">Curated products for specific health needs</p>
 </div>
 <button onClick={() => navigate('/products')} className="text-sm font-bold text-[var(--color-primary)] flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
 View All <ChevronRight size={14} />
 </button>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
 {CONCERNS.map((con, idx) => (
 <motion.button
 key={idx}
 onClick={() => navigate(`/products?search=${encodeURIComponent(con.query)}`)}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.04 }}
 whileHover={{ y: -4 }}
 className="bg-white rounded-2xl border border-slate-200/70 p-4 text-center cursor-pointer hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-200 group"
 >
 <div className="w-14 h-14 rounded-xl overflow-hidden mx-auto mb-3 border border-slate-100 ">
 <img
 src={con.img}
 alt={con.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150'; }}
 />
 </div>
 <span className="text-xs font-bold text-slate-700 group-hover:text-[var(--color-primary)] transition-colors">
 {con.title}
 </span>
 </motion.button>
 ))}
 </div>
 </section>

 {/* ─── BESTSELLING PRODUCTS ─── */}
 <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 border-t border-slate-100 ">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h2 className="text-xl font-black text-slate-900 ">Bestselling Products</h2>
 <p className="text-slate-400 text-sm font-medium mt-1">Verified & authenticated from manufacturers</p>
 </div>
 <button onClick={() => navigate('/products')} className="text-sm font-bold text-[var(--color-primary)] flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
 See More <ChevronRight size={14} />
 </button>
 </div>

 {loading ? (
 <SkeletonCard count={4} />
 ) : (
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {products.slice(0, 4).map((product, idx) => (
 <motion.div
 key={product.id}
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.08 }}
 whileHover={{ y: -4 }}
 className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-200 flex flex-col group"
 >
 {/* Discount */}
 {product.discount > 0 && (
 <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
 −{product.discount}%
 </span>
 )}

 {/* Image */}
 <div
 className="relative h-44 bg-slate-50 flex items-center justify-center p-4 cursor-pointer overflow-hidden border-b border-slate-100 "
 onClick={() => navigate(`/products/${product.id}`)}
 >
 <img
 src={product.image}
 alt={product.name}
 className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'; }}
 />
 </div>

 {/* Content */}
 <div className="p-4 flex-1 flex flex-col">
 <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{product.manufacturer}</span>
 <h3
 onClick={() => navigate(`/products/${product.id}`)}
 className="text-sm font-bold text-slate-800 line-clamp-2 mt-1 cursor-pointer hover:text-[var(--color-primary)] transition-colors leading-snug"
 >
 {product.name}
 </h3>
 <p className="text-[10px] text-slate-400 font-medium mt-1">{product.packSize}</p>

 {/* Rating */}
 {product.rating > 0 && (
 <div className="flex items-center gap-1.5 mt-2">
 <Star size={12} className="text-amber-400 fill-amber-400" />
 <span className="text-xs font-bold text-slate-700 ">{product.rating}</span>
 <span className="text-[10px] text-slate-400">({product.reviews})</span>
 </div>
 )}

 {/* Price + CTA */}
 <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 ">
 <div>
 {product.originalPrice > product.price && (
 <span className="text-[10px] text-slate-400 line-through block">₹{product.originalPrice}</span>
 )}
 <span className="text-base font-black text-slate-900 ">₹{product.price}</span>
 </div>
 <button
 onClick={() => navigate(`/products/${product.id}`)}
 className="px-3 py-1.5 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-xs hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-200 cursor-pointer"
 >
 ADD
 </button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </section>

 {/* ─── FAQS ─── */}
 <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 border-t border-slate-100 ">
 <div className="max-w-3xl mx-auto">
 <div className="text-center mb-8">
 <h2 className="text-xl font-black text-slate-900 flex items-center justify-center gap-2 mb-2">
 <HelpCircle size={20} className="text-[var(--color-primary)]" /> Frequently Asked Questions
 </h2>
 <p className="text-slate-400 text-sm font-medium">Your questions answered</p>
 </div>

 <div className="space-y-2">
 {FAQS.map((faq, idx) => {
 const isOpen = faqOpen === idx;
 return (
 <div
 key={idx}
 className="border border-slate-200/70 rounded-xl overflow-hidden bg-white transition-shadow hover:shadow-sm"
 >
 <button
 onClick={() => setFaqOpen(isOpen ? null : idx)}
 className="w-full flex items-center justify-between text-left px-5 py-4 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
 >
 <span>{faq.q}</span>
 <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
 <Plus size={16} className="text-[var(--color-primary)] shrink-0" />
 </motion.div>
 </button>
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.2 }}
 className="overflow-hidden"
 >
 <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
 {faq.a}
 </p>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
 })}
 </div>

 {/* Support CTA */}
 <div className="mt-8 p-5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
 <Phone size={16} className="text-[var(--color-primary)]" />
 </div>
 <div>
 <p className="text-sm font-bold text-slate-900 ">Still have questions?</p>
 <p className="text-xs text-slate-400 font-medium">Our support team is available 24/7</p>
 </div>
 </div>
 <button
 onClick={() => navigate('/contact')}
 className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-bold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer whitespace-nowrap"
 >
 Contact Us
 </button>
 </div>
 </div>
 </section>

 {/* Bottom spacer */}
 <div className="h-8" />
 </div>
 );
};

export default HomePage;
