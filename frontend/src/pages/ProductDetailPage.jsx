import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
 Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw,
 ChevronRight, Minus, Plus, AlertTriangle, Check, Loader2, Package
} from 'lucide-react';
import { productApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { PageTransition, SlideUp, FadeIn, StaggerContainer, StaggerItem, ScaleOnHover } from '../components/animations';

const demoProduct = {
 id: 1, name: 'Dolo 650mg Tablet', manufacturer: 'Micro Labs Ltd',
 description: 'Dolo 650 Tablet is a common painkiller used to treat aches and pains. It works by blocking chemical messengers that cause fever and pain. Used for headaches, body ache, toothache, and fever.',
 mrp: 30, sellingPrice: 25.50, discountPercent: 15, rating: 4.5, reviewCount: 1250,
 imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
 prescriptionRequired: false, inStock: true, stockQuantity: 150,
 category: { id: 1, name: 'Medicines' },
 uses: 'Pain relief, Fever reduction, Headache, Toothache, Body pain',
 sideEffects: 'Nausea, Allergic reaction (rare), Skin rash (rare)',
 howToUse: 'Take this medicine in the dose and duration as advised by your doctor. Swallow it as a whole. Do not chew, crush or break it.',
 safetyAdvice: 'Avoid consuming alcohol while taking this medicine. Consult your doctor if pregnant or breastfeeding.',
};

const demoRelated = [
 { id: 2, name: 'Crocin Advance 500mg', manufacturer: 'GSK', mrp: 25, sellingPrice: 21.25, discountPercent: 15, rating: 4.3, reviewCount: 890, imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300', prescriptionRequired: false },
 { id: 5, name: 'Volini Spray 100ml', manufacturer: 'Sun Pharma', mrp: 225, sellingPrice: 191.25, discountPercent: 15, rating: 4.1, reviewCount: 750, imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300', prescriptionRequired: false },
 { id: 11, name: 'Vicks VapoRub 50ml', manufacturer: 'P&G Health', mrp: 145, sellingPrice: 130.50, discountPercent: 10, rating: 4.5, reviewCount: 3200, imageUrl: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300', prescriptionRequired: false },
 { id: 4, name: 'Himalaya Liv.52 DS', manufacturer: 'Himalaya', mrp: 230, sellingPrice: 195.50, discountPercent: 15, rating: 4.6, reviewCount: 2100, imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300', prescriptionRequired: false },
];

export default function ProductDetailPage() {
 const { id } = useParams();
 const navigate = useNavigate();
 const { isAuthenticated } = useAuth();
 const { addItem } = useCart();
 const { success, error: showError } = useToast();

 const [product, setProduct] = useState(null);
 const [relatedProducts, setRelatedProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [quantity, setQuantity] = useState(1);
 const [activeTab, setActiveTab] = useState('description');
 const [addingToCart, setAddingToCart] = useState(false);
 const [wishlisted, setWishlisted] = useState(false);
 const [imgLoaded, setImgLoaded] = useState(false);

 useEffect(() => {
 window.scrollTo(0, 0);
 fetchProduct();
 }, [id]);

 const fetchProduct = async () => {
 setLoading(true);
 try {
 const response = await productApi.getById(id);
 setProduct(response.data.data || response.data);
 // Fetch related
 try {
 const relRes = await productApi.getAll({ page: 0, size: 4 });
 setRelatedProducts((relRes.data.data?.content || []).filter(p => p.id !== Number(id)));
 } catch { setRelatedProducts(demoRelated); }
 } catch {
 setProduct({ ...demoProduct, id: Number(id) });
 setRelatedProducts(demoRelated);
 } finally {
 setLoading(false);
 }
 };

 const handleAddToCart = async () => {
 if (!isAuthenticated) { navigate('/login'); return; }
 setAddingToCart(true);
 try {
 const result = await addItem(product.id, quantity);
 if (result) success(`${product.name} added to cart!`);
 else showError('Failed to add item to cart');
 } catch {
 showError('Failed to add item to cart');
 } finally {
 setAddingToCart(false);
 }
 };

 if (loading) {
 return (
 <div className="max-w-7xl mx-auto px-4 py-8">
 <div className="grid md:grid-cols-2 gap-8">
 <div className="aspect-square skeleton rounded-2xl" />
 <div className="space-y-4">
 <div className="h-4 skeleton w-1/3" />
 <div className="h-8 skeleton w-3/4" />
 <div className="h-4 skeleton w-1/2" />
 <div className="h-12 skeleton w-1/3 mt-4" />
 <div className="h-12 skeleton w-full mt-4" />
 </div>
 </div>
 </div>
 );
 }

 if (!product) return null;

 const p = product;
 const discount = p.discountPercent || (p.mrp > 0 ? Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100) : 0);
 const tabs = [
 { id: 'description', label: 'Description' },
 { id: 'uses', label: 'Uses' },
 { id: 'sideEffects', label: 'Side Effects' },
 { id: 'howToUse', label: 'How to Use' },
 ];

 return (
 <PageTransition>
 <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 text-[var(--text-primary)] #08111B] min-h-screen">
 {/* Dynamic mesh blob */}
 <div className="morphing-blob-premium absolute top-[10%] right-[10%] w-[300px] h-[300px] opacity-10" />

 {/* Breadcrumb */}
 <SlideUp>
 <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap text-slate-450 ">
 <Link to="/" className="hover:text-[#FF6F61] transition-colors font-bold">Home</Link>
 <ChevronRight size={12} />
 <Link to="/products" className="hover:text-[#FF6F61] transition-colors font-bold">Products</Link>
 <ChevronRight size={12} />
 {p.category && (
 <>
 <Link to={`/products?category=${p.category.id}`} className="hover:text-[#FF6F61] transition-colors font-bold">
 {p.category.name}
 </Link>
 <ChevronRight size={12} />
 </>
 )}
 <span className="font-black text-[#102A43] truncate max-w-[200px]">{p.name}</span>
 </nav>
 </SlideUp>

 <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
 {/* Product Image Panel */}
 <FadeIn>
 <div className="relative group">
 <div
 className="aspect-square rounded-3xl overflow-hidden glass-blur border border-slate-200/50 shadow-md p-6 flex items-center justify-center bg-white/80 #141D2F]/80"
 >
 {!imgLoaded && <div className="absolute inset-0 skeleton" />}
 <img
 src={p.imageUrl || demoProduct.imageUrl}
 alt={p.name}
 className={`max-h-[90%] max-w-[90%] object-contain transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'} mix-blend-multiply `}
 onLoad={() => setImgLoaded(true)}
 onError={(e) => { e.target.src = demoProduct.imageUrl; setImgLoaded(true); }}
 />
 </div>
 
 {/* Badges */}
 <div className="absolute top-4 left-4 flex flex-col gap-2">
 {discount > 0 && (
 <span className="px-3.5 py-1.5 rounded-full bg-[#EF4444] text-white text-[10px] font-black shadow-lg border border-red-500/20">
 {discount}% OFF
 </span>
 )}
 {p.prescriptionRequired && (
 <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-lg flex items-center gap-1.5 border border-amber-600/20">
 <AlertTriangle size={12} /> Rx Required
 </span>
 )}
 </div>
 
 {/* Actions */}
 <div className="absolute top-4 right-4 flex flex-col gap-2">
 <button
 onClick={() => { setWishlisted(!wishlisted); success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!'); }}
 className="w-10 h-10 rounded-xl bg-white #141D2F] flex items-center justify-center shadow-md border border-slate-200/50 hover:border-[#FF6F61] transition-all cursor-pointer"
 >
 <Heart size={18} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
 </button>
 <button
 onClick={() => { navigator.clipboard.writeText(window.location.href); success('Link copied!'); }}
 className="w-10 h-10 rounded-xl bg-white #141D2F] flex items-center justify-center shadow-md border border-slate-200/50 hover:border-[#FF6F61] transition-all cursor-pointer"
 >
 <Share2 size={18} className="text-slate-400" />
 </button>
 </div>
 </div>
 </FadeIn>

 {/* Product Info */}
 <SlideUp delay={0.1}>
 <div className="space-y-6">
 {/* Manufacturer */}
 <p className="text-xs font-black uppercase tracking-widest text-[#FF6F61]">{p.manufacturer}</p>

 {/* Title */}
 <h1 className="text-3xl font-black text-[#102A43] leading-tight">
 {p.name}
 </h1>

 {/* Rating */}
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/10 shadow-sm">
 <Star size={13} className="text-amber-500 fill-amber-500 animate-pulse" />
 <span className="text-xs font-black text-amber-600 ">{p.rating || 4.5}</span>
 </div>
 <span className="text-xs font-bold text-slate-450 ">
 {(p.reviewCount || 0).toLocaleString()} reviews
 </span>
 </div>

 {/* Price */}
 <div className="flex items-baseline gap-3 flex-wrap">
 <span className="text-3xl font-black text-[#FF6F61]">₹{(p.sellingPrice || 0).toFixed(2)}</span>
 {p.mrp > p.sellingPrice && (
 <>
 <span className="text-sm line-through text-slate-400 font-bold">₹{p.mrp}</span>
 <span className="px-3 py-1 rounded-full bg-[#0D8D6C]/10 text-[#0D8D6C] text-xs font-black border border-[#0D8D6C]/15 shadow-sm">
 Save ₹{(p.mrp - p.sellingPrice).toFixed(2)}
 </span>
 </>
 )}
 </div>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider -mt-2">Inclusive of all taxes</p>

 {/* Stock status */}
 <div className="flex items-center gap-2">
 {p.inStock !== false ? (
 <span className="flex items-center gap-1.5 text-xs font-black text-green-600 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/15">
 <Check size={14} /> In Stock
 </span>
 ) : (
 <span className="flex items-center gap-1.5 text-xs font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/15 animate-pulse">
 <AlertTriangle size={14} /> Out of Stock
 </span>
 )}
 </div>

 {/* Quantity Picker & Add button */}
 <div className="flex items-center gap-4 flex-wrap pt-2">
 <div className="flex items-center gap-0 rounded-2xl overflow-hidden bg-white/50 border-2 border-slate-200 shadow-inner">
 <button
 onClick={() => setQuantity(Math.max(1, quantity - 1))}
 className="w-12 h-12 flex items-center justify-center hover:bg-[#FFF3F2]/50 transition-colors cursor-pointer"
 >
 <Minus size={14} className="text-slate-600 " />
 </button>
 <span className="w-12 text-center text-sm font-black text-[#102A43] ">
 {quantity}
 </span>
 <button
 onClick={() => setQuantity(Math.min(10, quantity + 1))}
 className="w-12 h-12 flex items-center justify-center hover:bg-[#FFF3F2]/50 transition-colors cursor-pointer"
 >
 <Plus size={14} className="text-slate-600 " />
 </button>
 </div>

 <motion.button
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 onClick={handleAddToCart}
 disabled={addingToCart || p.inStock === false}
 className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-black text-xs flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 shadow-md btn-shine cursor-pointer"
 >
 {addingToCart ? (
 <Loader2 size={18} className="animate-spin" />
 ) : (
 <>
 <ShoppingCart size={16} /> Add to Cart
 </>
 )}
 </motion.button>
 </div>

 {/* Trust badges */}
 <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/50 ">
 {[
 { icon: <Shield size={18} />, text: '100% Genuine' },
 { icon: <Truck size={18} />, text: 'Fast Delivery' },
 { icon: <RotateCcw size={18} />, text: 'Easy Returns' },
 ].map(f => (
 <div key={f.text} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/60 #141D2F]/60 border border-slate-200/50 shadow-sm">
 <span className="text-[#FF6F61]">{f.icon}</span>
 <span className="text-[10px] font-bold text-slate-500 ">{f.text}</span>
 </div>
 ))}
 </div>
 </div>
 </SlideUp>
 </div>

 {/* Tabs Section */}
 <section className="mt-16">
 <div className="flex gap-2 border-b border-slate-200/50 mb-6 overflow-x-auto">
 {tabs.map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`px-5 py-3.5 text-xs font-black whitespace-nowrap transition-all relative cursor-pointer ${
 activeTab === tab.id ? 'text-[#FF6F61]' : 'text-slate-500 '
 }`}
 >
 {tab.label}
 {activeTab === tab.id && (
 <motion.div
 layoutId="activeProductTab"
 className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6F61] rounded-full"
 transition={{ type: "spring", stiffness: 380, damping: 30 }}
 />
 )}
 </button>
 ))}
 </div>

 <FadeIn key={activeTab}>
 <div className="rounded-3xl p-6 md:p-8 glass-blur border border-slate-200/50 shadow-sm">
 {activeTab === 'description' && (
 <div className="prose max-w-none text-xs font-bold leading-relaxed text-slate-600 ">
 <p>{p.description || demoProduct.description}</p>
 {p.safetyAdvice && (
 <div className="mt-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/10 shadow-sm">
 <h4 className="font-black text-amber-800 mb-1.5 text-xs">⚠️ Safety Advice</h4>
 <p className="text-amber-700 font-semibold leading-relaxed">{p.safetyAdvice || demoProduct.safetyAdvice}</p>
 </div>
 )}
 </div>
 )}
 {activeTab === 'uses' && (
 <div className="space-y-3">
 {(p.uses || demoProduct.uses).split(',').map((use, i) => (
 <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-600 ">
 <Check size={16} className="text-green-500 flex-shrink-0" />
 <span>{use.trim()}</span>
 </div>
 ))}
 </div>
 )}
 {activeTab === 'sideEffects' && (
 <div className="space-y-3">
 {(p.sideEffects || demoProduct.sideEffects).split(',').map((effect, i) => (
 <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-600 ">
 <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
 <span>{effect.trim()}</span>
 </div>
 ))}
 </div>
 )}
 {activeTab === 'howToUse' && (
 <p className="text-xs font-bold leading-relaxed text-slate-600 ">
 {p.howToUse || demoProduct.howToUse}
 </p>
 )}
 </div>
 </FadeIn>
 </section>

 {/* Related Products */}
 {relatedProducts.length > 0 && (
 <section className="mt-16 pb-8">
 <SlideUp>
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-xl md:text-2xl font-black text-[#102A43] ">
 Similar Products
 </h2>
 <Link to="/products" className="text-xs font-black text-[#FF6F61] hover:underline">View All</Link>
 </div>
 </SlideUp>

 <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
 {relatedProducts.slice(0, 4).map(rp => (
 <StaggerItem key={rp.id}>
 <ScaleOnHover>
 <Link to={`/products/${rp.id}`} className="block rounded-3xl overflow-hidden group glass-blur border border-slate-200/50 shadow-md hover:shadow-xl hover:border-[#FF6F61]/30 hover:-translate-y-1 transition-all duration-300">
 <div className="aspect-square overflow-hidden relative flex items-center justify-center p-4 bg-slate-50 border-b border-slate-100 ">
 <img src={rp.imageUrl} alt={rp.name}
 className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-350 mix-blend-multiply "
 onError={(e) => { e.target.src = demoProduct.imageUrl; }} />
 {rp.discountPercent > 0 && (
 <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black shadow-md border border-red-500/20">
 {rp.discountPercent}% OFF
 </span>
 )}
 </div>
 <div className="p-4">
 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{rp.manufacturer}</p>
 <h3 className="text-xs font-black mt-0.5 line-clamp-2 text-[#102A43] group-hover:text-[#FF6F61] transition-colors leading-snug min-h-[2.4rem]">{rp.name}</h3>
 <div className="flex items-center gap-1 mt-2">
 <Star size={10} className="text-amber-500 fill-amber-500" />
 <span className="text-[10px] font-black text-slate-700 ">{rp.rating}</span>
 </div>
 <div className="flex items-baseline gap-2 mt-3 pt-2 border-t border-slate-100 ">
 <span className="text-base font-black text-[#FF6F61]">₹{rp.sellingPrice}</span>
 <span className="text-[10px] line-through text-slate-400 font-bold">₹{rp.mrp}</span>
 </div>
 </div>
 </Link>
 </ScaleOnHover>
 </StaggerItem>
 ))}
 </StaggerContainer>
 </section>
 )}
 </div>
 </PageTransition>
 );
}
