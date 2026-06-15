import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ShoppingCart, ChevronLeft, ChevronRight, X, SlidersHorizontal, Grid3X3, LayoutGrid, List, Eye, Pill, Plus } from 'lucide-react';
import { productApi, categoryApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductsPage() {
 const [searchParams, setSearchParams] = useSearchParams();
 const navigate = useNavigate();
 const { isAuthenticated } = useAuth();
 const { addItem } = useCart();

 const [products, setProducts] = useState([]);
 const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(true);
 const [page, setPage] = useState(0);
 const [totalPages, setTotalPages] = useState(0);
 const [filterOpen, setFilterOpen] = useState(false);
 const [viewMode, setViewMode] = useState('grid4'); // grid3, grid4, list

 const searchQuery = searchParams.get('search') || '';
 const categoryId = searchParams.get('category') || '';
 const sortBy = searchParams.get('sort') || 'id';
 const sortDir = searchParams.get('dir') || 'desc';

 useEffect(() => { fetchProducts(); fetchCategories(); }, [searchQuery, categoryId, sortBy, sortDir, page]);

 const fetchProducts = async () => {
 setLoading(true);
 try {
 let response;
 if (searchQuery) response = await productApi.search(searchQuery, { page, size: 12 });
 else if (categoryId) response = await productApi.getByCategory(categoryId, { page, size: 12 });
 else response = await productApi.getAll({ page, size: 12, sortBy, sortDir });
 const data = response.data.data;
 setProducts(data.content || []);
 setTotalPages(data.totalPages || 1);
 } catch {
 setProducts([
 { id: 1, name: 'Dolo 650mg Tablet', manufacturer: 'Micro Labs', mrp: 30, sellingPrice: 25.50, discountPercent: 15, rating: 4.5, reviewCount: 1250, imageUrl: '/images/pain_relief.png', prescriptionRequired: false, inStock: true },
 { id: 2, name: 'Crocin Advance 500mg', manufacturer: 'GSK Pharma', mrp: 25, sellingPrice: 21.25, discountPercent: 15, rating: 4.3, reviewCount: 890, imageUrl: '/images/vitamin_c.png', prescriptionRequired: false, inStock: true },
 { id: 4, name: 'Himalaya Liv.52 DS', manufacturer: 'Himalaya', mrp: 230, sellingPrice: 195.50, discountPercent: 15, rating: 4.6, reviewCount: 2100, imageUrl: '/images/immune_booster.png', prescriptionRequired: false, inStock: true },
 { id: 5, name: 'Volini Spray 100ml', manufacturer: 'Sun Pharma', mrp: 225, sellingPrice: 191.25, discountPercent: 15, rating: 4.1, reviewCount: 750, imageUrl: '/images/sleep_wellness.png', prescriptionRequired: false, inStock: true },
 { id: 7, name: 'Neutrogena SPF 50', manufacturer: 'J&J', mrp: 599, sellingPrice: 479.20, discountPercent: 20, rating: 4.3, reviewCount: 1560, imageUrl: '/images/derma_cream.png', prescriptionRequired: false, inStock: true },
 { id: 8, name: 'Accu-Chek Glucometer', manufacturer: 'Roche', mrp: 1299, sellingPrice: 999, discountPercent: 23, rating: 4.5, reviewCount: 430, imageUrl: '/images/multivitamin.png', prescriptionRequired: false, inStock: true },
 { id: 9, name: 'Centrum Multivitamin', manufacturer: 'Pfizer', mrp: 450, sellingPrice: 382.50, discountPercent: 15, rating: 4.4, reviewCount: 1200, imageUrl: '/images/vitamin_c.png', prescriptionRequired: false, inStock: true },
 { id: 13, name: 'Dabur Chyawanprash', manufacturer: 'Dabur', mrp: 270, sellingPrice: 229.50, discountPercent: 15, rating: 4.5, reviewCount: 4500, imageUrl: '/images/immune_booster.png', prescriptionRequired: false, inStock: true },
 { id: 11, name: 'Vicks VapoRub 50ml', manufacturer: 'P&G Health', mrp: 145, sellingPrice: 130.50, discountPercent: 10, rating: 4.5, reviewCount: 3200, imageUrl: '/images/sleep_wellness.png', prescriptionRequired: false, inStock: true },
 ]);
 setTotalPages(1);
 } finally { setLoading(false); }
 };

 const fetchCategories = async () => {
 try { const r = await categoryApi.getAll(); setCategories(r.data.data || []); }
 catch { setCategories([{ id: 1, name: 'Medicines' }, { id: 2, name: 'Wellness' }, { id: 3, name: 'Personal Care' }, { id: 4, name: 'Healthcare Devices' }, { id: 5, name: 'Vitamins' }, { id: 6, name: 'Ayurveda' }, { id: 7, name: 'Diabetes Care' }, { id: 8, name: 'Skin Care' }]); }
 };

 const handleAddToCart = async (productId) => {
 if (!isAuthenticated) { navigate('/login'); return; }
 await addItem(productId);
 };

 const gridClass = viewMode === 'grid3' ? 'grid-cols-2 md:grid-cols-3' : viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

 return (
 <div className="min-h-screen bg-[var(--bg-primary)] #08111B] text-[var(--text-primary)] relative overflow-hidden">
 {/* Dynamic Background mesh blob */}
 <div className="morphing-blob-premium absolute top-[5%] right-[5%] w-[350px] h-[350px] opacity-10" />

 {/* Premium Header Banner */}
 <div className="relative bg-mesh-gradient border-b border-slate-200/50 overflow-hidden py-10">
 <div className="absolute inset-0 dot-grid-bg opacity-10" />
 <div className="max-w-7xl mx-auto px-6 relative z-10">
 <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-xl bg-[#FFF3F2] #FF6F61]/10 flex items-center justify-center border border-[#FF6F61]/10 shadow-sm">
 <Pill size={20} className="text-[#FF6F61] #FFA49A]" />
 </div>
 <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">ONEC Pharmacy</span>
 </div>
 <h1 className="text-3xl font-black tracking-tight text-[#102A43] mb-1">
 {searchQuery ? `Results for "${searchQuery}"` : categoryId ? 'Category Products' : 'All Products'}
 </h1>
 <p className="text-slate-500 text-xs font-bold">{products.length} products found</p>
 </motion.div>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-6 py-8">
 {/* Controls Row */}
 <div className="flex items-center justify-between gap-4 mb-8">
 <button onClick={() => setFilterOpen(!filterOpen)}
 className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold glass-blur border border-slate-200/50 hover-glow">
 <SlidersHorizontal size={14} /> Filters
 </button>

 <div className="hidden md:flex items-center gap-2">
 {[
 { mode: 'grid4', icon: Grid3X3, label: '4 Columns' },
 { mode: 'grid3', icon: LayoutGrid, label: '3 Columns' },
 { mode: 'list', icon: List, label: 'List' },
 ].map(({ mode, icon: Icon }) => (
 <button key={mode} onClick={() => setViewMode(mode)}
 className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${viewMode === mode ? 'bg-[#FF6F61] text-white shadow' : 'bg-white/80 #141D2F]/80 backdrop-blur border border-slate-200/50 text-slate-500 hover:border-[#FF6F61]/30 hover:text-[#FF6F61] cursor-pointer'}`}>
 <Icon size={16} />
 </button>
 ))}
 </div>

 <select value={`${sortBy}-${sortDir}`}
 onChange={(e) => { const [s, d] = e.target.value.split('-'); setSearchParams(prev => { prev.set('sort', s); prev.set('dir', d); return prev; }); }}
 className="px-4 py-2.5 rounded-xl text-xs font-bold outline-none glass-blur border border-slate-200/50 cursor-pointer text-[#102A43] ">
 <option value="id-desc">Newest First</option>
 <option value="sellingPrice-asc">Price: Low to High</option>
 <option value="sellingPrice-desc">Price: High to Low</option>
 <option value="rating-desc">Top Rated</option>
 <option value="name-asc">Name: A-Z</option>
 </select>
 </div>

 <div className="flex gap-8 relative z-10">
 {/* Sidebar Filters */}
 <aside className={`${filterOpen ? 'fixed inset-0 z-50 bg-black/50 md:relative md:bg-transparent' : 'hidden md:block'} md:w-56 shrink-0`}>
 <div className={`${filterOpen ? 'absolute right-0 top-0 h-full w-72 p-6 bg-[var(--bg-surface)] #141D2F] border-l border-slate-200/50 ' : 'sticky top-24 glass-blur border border-slate-200/50 '} rounded-3xl p-5 shadow-md`}>
 {filterOpen && (
 <button onClick={() => setFilterOpen(false)} className="md:hidden absolute top-4 right-4 text-[var(--text-primary)] cursor-pointer">
 <X size={18} />
 </button>
 )}
 <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-[var(--text-muted)]">Categories</h3>
 <div className="flex flex-col gap-1.5">
 <button onClick={() => { setSearchParams({}); setFilterOpen(false); }}
 className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-black transition-all relative cursor-pointer ${!categoryId ? 'text-white' : 'text-slate-600 hover:bg-[#FFF3F2]/60'}`}>
 {!categoryId && (
 <motion.div layoutId="sidebarActiveCat" className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-xl -z-10 shadow" />
 )}
 <span className="relative z-10">All Products</span>
 </button>
 {categories.map(cat => (
 <button key={cat.id}
 onClick={() => { setSearchParams({ category: cat.id.toString() }); setFilterOpen(false); }}
 className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-black transition-all relative cursor-pointer ${categoryId === cat.id.toString() ? 'text-white' : 'text-slate-600 hover:bg-[#FFF3F2]/60'}`}>
 {categoryId === cat.id.toString() && (
 <motion.div layoutId="sidebarActiveCat" className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-xl -z-10 shadow" />
 )}
 <span className="relative z-10">{cat.name}</span>
 </button>
 ))}
 </div>
 </div>
 </aside>

 {/* Product Grid */}
 <div className="flex-1">
 {loading ? (
 <div className={`grid ${gridClass} gap-6`}>
 {Array.from({ length: 8 }).map((_, i) => (
 <div key={i} className="rounded-3xl overflow-hidden glass-blur border border-slate-200/50 shadow-sm animate-pulse">
 <div className="aspect-square bg-slate-100 " />
 <div className="p-5 space-y-3">
 <div className="h-3 bg-slate-200 w-1/3 rounded-full" />
 <div className="h-4 bg-slate-200 w-3/4 rounded-full" />
 <div className="h-3 bg-slate-200 w-1/2 rounded-full" />
 <div className="h-10 bg-slate-200 w-full mt-3 rounded-xl" />
 </div>
 </div>
 ))}
 </div>
 ) : products.length === 0 ? (
 /* Empty State */
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
 <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-6">
 <Search size={32} className="text-[var(--color-primary)] animate-bounce-gentle" />
 </div>
 <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">No products found</h3>
 <p className="text-xs text-[var(--text-secondary)] font-bold mb-6 max-w-sm">Try adjusting your search or filter to find what you're looking for.</p>
 <button onClick={() => setSearchParams({})} className="px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-white text-xs font-black hover:shadow-lg transition-all cursor-pointer">
 View All Products
 </button>
 </motion.div>
 ) : (
 <div className={`grid ${gridClass} gap-6`}>
 <AnimatePresence mode="popLayout">
 {products.map((product, idx) => (
 <motion.div
 key={product.id}
 layout
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ delay: idx * 0.03 }}
 className={`rounded-3xl overflow-hidden group transition-all duration-300 hover:border-[#FF6F61]/40 hover:shadow-xl glass-blur border border-slate-200/50 relative ${viewMode === 'list' ? 'flex items-center p-3 gap-5' : ''}`}
 >
 {/* Image zoom */}
 <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'} bg-slate-50 flex items-center justify-center border-b border-slate-100 `}>
 <img src={product.imageUrl} alt={product.name}
 className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply "
 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'; }} />
 
 {/* Hover overlay */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
 <motion.button
 initial={{ opacity: 0, scale: 0.8 }}
 whileHover={{ scale: 1.1 }}
 onClick={() => navigate(`/products/${product.id}`)}
 className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg backdrop-blur-sm cursor-pointer border border-slate-100 "
 >
 <Eye size={16} className="text-[var(--color-primary)]" />
 </motion.button>
 </div>
 
 {product.discountPercent > 0 && (
 <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#EF4444] text-white text-[9px] font-black shadow-md border border-red-500/20">
 {Math.round(product.discountPercent)}% OFF
 </span>
 )}
 {product.prescriptionRequired && (
 <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[9px] font-black shadow-md">Rx</span>
 )}
 </div>
 
 {/* Content */}
 <div className={`p-5 flex flex-col justify-between ${viewMode === 'list' ? 'flex-1' : ''}`}>
 <div>
 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{product.manufacturer}</p>
 <h3 className="text-xs font-black mb-1.5 line-clamp-2 leading-snug min-h-[2.4rem] text-[var(--text-primary)]">
 <Link to={`/products/${product.id}`} className="hover:text-[var(--color-primary)] transition-colors">{product.name}</Link>
 </h3>
 
 {/* Rating */}
 <div className="flex items-center gap-1.5 mb-3">
 <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/10 shadow-sm">
 <Star size={10} className="text-amber-500 fill-amber-500 animate-pulse" />
 <span className="text-[10px] font-black text-amber-600 ">{product.rating}</span>
 </div>
 <span className="text-[9px] font-extrabold text-[var(--text-muted)]">({product.reviewCount})</span>
 </div>
 </div>
 
 <div>
 {/* Price */}
 <div className="flex items-baseline gap-2 mb-4">
 <span className="text-lg font-black text-[var(--color-primary)]">₹{product.sellingPrice}</span>
 <span className="text-xs line-through text-[var(--text-muted)] font-bold">₹{product.mrp}</span>
 </div>
 
 {/* Add to Cart Button */}
 <motion.button
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => handleAddToCart(product.id)}
 className="w-full py-2.5 px-3 border-2 border-[#FF6F61] text-[#FF6F61] hover:bg-[#FF6F61] hover:text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-white btn-shine"
 >
 ADD <Plus size={12} />
 </motion.button>
 </div>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 )}

 {/* Premium Pagination */}
 {totalPages > 1 && (
 <div className="flex justify-center items-center gap-2 mt-10">
 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
 onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
 className="w-10 h-10 rounded-xl flex items-center justify-center glass-blur disabled:opacity-30 hover-glow transition-all cursor-pointer border border-slate-200/50 ">
 <ChevronLeft size={16} />
 </motion.button>
 {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
 <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
 onClick={() => setPage(i)}
 className={`w-10 h-10 rounded-xl text-xs font-black transition-all cursor-pointer ${page === i ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-md' : 'glass-blur text-[var(--text-primary)] hover-glow border border-slate-200/50 '}`}>
 {i + 1}
 </motion.button>
 ))}
 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
 onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
 className="w-10 h-10 rounded-xl flex items-center justify-center glass-blur disabled:opacity-30 hover-glow transition-all cursor-pointer border border-slate-200/50 ">
 <ChevronRight size={16} />
 </motion.button>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
