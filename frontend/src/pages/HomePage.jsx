import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
 Search, ArrowRight, ShoppingCart, Star, Shield, Truck, Clock, 
 Pill, Heart, Activity, Stethoscope, Eye, Baby, Leaf, Droplets,
 ChevronLeft, ChevronRight, Upload, Sparkles, TrendingUp, Zap
} from 'lucide-react';
import { SlideUp, StaggerContainer, StaggerItem, ScaleOnHover, FadeIn } from '../components/animations';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { PageTransition } from '../components/animations';

const heroSlides = [
 {
 title: 'Your Health, Our Priority',
 subtitle: 'Get genuine medicines delivered to your doorstep with up to 25% off',
 cta: 'Shop Now',
 gradient: 'from-emerald-600 via-teal-600 to-emerald-800',
 icon: '💊',
 },
 {
 title: 'Upload Prescription',
 subtitle: 'Simply upload your prescription and get medicines delivered in 24 hours',
 cta: 'Upload Now',
 gradient: 'from-teal-600 via-cyan-600 to-teal-800',
 icon: '📋',
 },
 {
 title: 'AI Health Assistant',
 subtitle: 'Get personalized health recommendations powered by artificial intelligence',
 cta: 'Try Now',
 gradient: 'from-emerald-700 via-emerald-600 to-teal-700',
 icon: '🤖',
 },
];

const categories = [
 { id: 1, name: 'Medicines', icon: <Pill size={24} />, color: 'bg-emerald-100 text-emerald-700', darkColor: ' ' },
 { id: 2, name: 'Wellness', icon: <Heart size={24} />, color: 'bg-pink-100 text-pink-700', darkColor: ' ' },
 { id: 3, name: 'Personal Care', icon: <Droplets size={24} />, color: 'bg-blue-100 text-blue-700', darkColor: ' ' },
 { id: 4, name: 'Healthcare Devices', icon: <Stethoscope size={24} />, color: 'bg-purple-100 text-purple-700', darkColor: ' ' },
 { id: 5, name: 'Vitamins', icon: <Zap size={24} />, color: 'bg-amber-100 text-amber-700', darkColor: ' ' },
 { id: 6, name: 'Ayurveda', icon: <Leaf size={24} />, color: 'bg-green-100 text-green-700', darkColor: ' ' },
 { id: 7, name: 'Diabetes Care', icon: <Activity size={24} />, color: 'bg-red-100 text-red-700', darkColor: ' ' },
 { id: 8, name: 'Skin Care', icon: <Sparkles size={24} />, color: 'bg-violet-100 text-violet-700', darkColor: ' ' },
 { id: 9, name: 'Baby Care', icon: <Baby size={24} />, color: 'bg-orange-100 text-orange-700', darkColor: ' ' },
 { id: 10, name: 'Eye Care', icon: <Eye size={24} />, color: 'bg-cyan-100 text-cyan-700', darkColor: ' ' },
];

const featuredProducts = [
 { id: 1, name: 'Dolo 650mg Tablet', manufacturer: 'Micro Labs', mrp: 30, sellingPrice: 25.50, discount: 15, rating: 4.5, reviews: 1250, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300', prescription: false },
 { id: 4, name: 'Himalaya Liv.52 DS', manufacturer: 'Himalaya', mrp: 230, sellingPrice: 195.50, discount: 15, rating: 4.6, reviews: 2100, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300', prescription: false },
 { id: 8, name: 'Accu-Chek Glucometer', manufacturer: 'Roche', mrp: 1299, sellingPrice: 999, discount: 23, rating: 4.5, reviews: 430, image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300', prescription: false },
 { id: 9, name: 'Centrum Multivitamin', manufacturer: 'Pfizer', mrp: 450, sellingPrice: 382.50, discount: 15, rating: 4.4, reviews: 1200, image: 'https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=300', prescription: false },
 { id: 7, name: 'Neutrogena SPF 50', manufacturer: 'J&J', mrp: 599, sellingPrice: 479.20, discount: 20, rating: 4.3, reviews: 1560, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300', prescription: false },
 { id: 13, name: 'Dabur Chyawanprash', manufacturer: 'Dabur', mrp: 270, sellingPrice: 229.50, discount: 15, rating: 4.5, reviews: 4500, image: 'https://images.unsplash.com/photo-1505576399279-0d309cb92cf6?w=300', prescription: false },
];

const healthConditions = [
 { name: 'Diabetes', icon: '🩸', products: 120 },
 { name: 'Heart Care', icon: '❤️', products: 85 },
 { name: 'Digestive Health', icon: '🫁', products: 95 },
 { name: 'Cold & Flu', icon: '🤧', products: 150 },
 { name: 'Pain Relief', icon: '💪', products: 110 },
 { name: 'Skin Problems', icon: '✨', products: 75 },
];

const testimonials = [
 { name: 'Priya Sharma', text: 'ONEC Pharma delivers medicines faster than any other platform. The AI recommendations are spot on!', rating: 5, avatar: 'P' },
 { name: 'Rahul Verma', text: 'Best prices on genuine medicines. The prescription upload feature saves so much time.', rating: 5, avatar: 'R' },
 { name: 'Anita Patel', text: 'The drug interaction checker is a lifesaver. Excellent customer support team!', rating: 4, avatar: 'A' },
];

export default function HomePage() {
 const [currentSlide, setCurrentSlide] = useState(0);
 const navigate = useNavigate();
 const { isAuthenticated } = useAuth();
 const { addItem } = useCart();

 // Auto-play hero carousel
 useEffect(() => {
 const interval = setInterval(() => {
 setCurrentSlide(prev => (prev + 1) % heroSlides.length);
 }, 5000);
 return () => clearInterval(interval);
 }, []);

 const handleAddToCart = async (productId) => {
 if (!isAuthenticated) {
 navigate('/login');
 return;
 }
 await addItem(productId);
 };

 return (
 <PageTransition>
 <div className="min-h-screen relative overflow-hidden">
 {/* Floating Ambient Background Blobs */}
 <div className="absolute top-[10%] left-[-10%] w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl animate-float-blob pointer-events-none -z-10" />
 <div className="absolute top-[45%] right-[-10%] w-96 h-96 rounded-full bg-teal-500/10 blur-3xl animate-float-blob pointer-events-none -z-10" style={{ animationDelay: '2s' }} />
 <div className="absolute bottom-[20%] left-[10%] w-80 h-80 rounded-full bg-amber-500/5 blur-3xl animate-float-blob pointer-events-none -z-10" style={{ animationDelay: '4s' }} />

 {/* ===== HERO SECTION ===== */}
 <section className="relative overflow-hidden">
 <AnimatePresence mode="wait">
 <motion.div
 key={currentSlide}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.6 }}
 className={`bg-gradient-to-br ${heroSlides[currentSlide].gradient} py-16 md:py-24 px-4`}
 >
 <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
 <motion.div
 initial={{ opacity: 0, x: -30 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.2, duration: 0.5 }}
 className="text-white max-w-xl"
 >
 <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-sm font-medium mb-4 backdrop-blur-sm">
 ✨ India's Most Trusted AI Pharmacy
 </span>
 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
 {heroSlides[currentSlide].title}
 </h1>
 <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
 {heroSlides[currentSlide].subtitle}
 </p>
 <div className="flex flex-wrap gap-3">
 <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold text-sm hover:bg-white/90 transition-all shadow-lg hover:shadow-xl">
 {heroSlides[currentSlide].cta} <ArrowRight size={18} />
 </Link>
 <Link to="/prescription-upload" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20">
 <Upload size={18} /> Upload Prescription
 </Link>
 </div>
 </motion.div>
 <motion.div
 initial={{ opacity: 0, scale: 0.8 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.3, duration: 0.5 }}
 className="text-[120px] md:text-[160px] select-none"
 >
 {heroSlides[currentSlide].icon}
 </motion.div>
 </div>
 </motion.div>
 </AnimatePresence>

 {/* Slide Indicators */}
 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
 {heroSlides.map((_, i) => (
 <button
 key={i}
 onClick={() => setCurrentSlide(i)}
 className={`w-2.5 h-2.5 rounded-full transition-all ${
 i === currentSlide ? 'w-8 bg-white' : 'bg-white/50'
 }`}
 />
 ))}
 </div>
 </section>

 {/* ===== TRUST STRIP ===== */}
 <section className="py-4 border-b" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
 <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16">
 {[
 { icon: <Shield size={20} className="text-primary" />, text: '100% Genuine' },
 { icon: <Truck size={20} className="text-primary" />, text: 'Free Delivery ₹499+' },
 { icon: <Clock size={20} className="text-primary" />, text: '24hr Delivery' },
 { icon: <Star size={20} className="text-primary" />, text: '4.8★ Rating' },
 ].map(item => (
 <div key={item.text} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
 {item.icon}
 {item.text}
 </div>
 ))}
 </div>
 </section>

 {/* ===== CATEGORIES ===== */}
 <section className="py-12 px-4">
 <div className="max-w-7xl mx-auto">
 <SlideUp>
 <div className="flex justify-between items-center mb-8">
 <div>
 <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 Shop by Category
 </h2>
 <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
 Browse our wide range of healthcare products
 </p>
 </div>
 <Link to="/products" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
 View All <ArrowRight size={14} />
 </Link>
 </div>
 </SlideUp>

 <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
 {categories.map(cat => (
 <StaggerItem key={cat.id}>
 <ScaleOnHover>
 <Link
 to={`/products?category=${cat.id}`}
 className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-200 hover:shadow-lg"
 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
 >
 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.color}`}>
 {cat.icon}
 </div>
 <span className="text-sm font-medium text-center" style={{ color: 'var(--text-primary)' }}>{cat.name}</span>
 </Link>
 </ScaleOnHover>
 </StaggerItem>
 ))}
 </StaggerContainer>
 </div>
 </section>

 {/* ===== FEATURED PRODUCTS ===== */}
 <section className="py-12 px-4" style={{ background: 'var(--bg-surface)' }}>
 <div className="max-w-7xl mx-auto">
 <SlideUp>
 <div className="flex justify-between items-center mb-8">
 <div>
 <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
 <TrendingUp size={12} className="inline mr-1" /> TRENDING
 </span>
 <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 Featured Products
 </h2>
 </div>
 <Link to="/products" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
 View All <ArrowRight size={14} />
 </Link>
 </div>
 </SlideUp>

 <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
 {featuredProducts.map(product => (
 <StaggerItem key={product.id}>
 <ScaleOnHover>
 <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl group glow-border"
 style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
 {/* Image */}
 <div className="relative aspect-square overflow-hidden">
 <img src={product.image} alt={product.name}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
 {product.discount > 0 && (
 <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-red-500 text-white text-xs font-bold">
 {product.discount}% OFF
 </span>
 )}
 {product.prescription && (
 <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-amber-500 text-white text-xs font-bold">
 Rx
 </span>
 )}
 </div>
 {/* Info */}
 <div className="p-3">
 <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{product.manufacturer}</p>
 <h3 className="text-sm font-semibold mb-1 line-clamp-2 leading-tight" style={{ color: 'var(--text-primary)' }}>
 <Link to={`/products/${product.id}`} className="hover:text-primary transition-colors">
 {product.name}
 </Link>
 </h3>
 <div className="flex items-center gap-1 mb-2">
 <Star size={12} className="text-amber-400 fill-amber-400" />
 <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{product.rating}</span>
 <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({product.reviews})</span>
 </div>
 <div className="flex items-baseline gap-2 mb-3">
 <span className="text-base font-bold text-primary">₹{product.sellingPrice}</span>
 <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>₹{product.mrp}</span>
 </div>
 <motion.button
 whileHover={{ scale: 1.03 }}
 whileTap={{ scale: 0.97 }}
 onClick={() => handleAddToCart(product.id)}
 className="w-full py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary hover:opacity-95 hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
 >
 <ShoppingCart size={13} /> Add to Cart
 </motion.button>
 </div>
 </div>
 </ScaleOnHover>
 </StaggerItem>
 ))}
 </StaggerContainer>
 </div>
 </section>

 {/* ===== SHOP BY HEALTH CONDITION ===== */}
 <section className="py-12 px-4">
 <div className="max-w-7xl mx-auto">
 <SlideUp>
 <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 Shop by Health Condition
 </h2>
 <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Find medicines for your health needs</p>
 </SlideUp>

 <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
 {healthConditions.map(condition => (
 <StaggerItem key={condition.name}>
 <ScaleOnHover>
 <Link to="/products" className="block p-5 rounded-2xl text-center transition-all hover:shadow-lg"
 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 <span className="text-3xl block mb-2">{condition.icon}</span>
 <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{condition.name}</h3>
 <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{condition.products}+ Products</p>
 </Link>
 </ScaleOnHover>
 </StaggerItem>
 ))}
 </StaggerContainer>
 </div>
 </section>

 {/* ===== OFFERS BANNER ===== */}
 <section className="py-12 px-4">
 <div className="max-w-7xl mx-auto">
 <div className="grid md:grid-cols-2 gap-6">
 <FadeIn delay={0.1}>
 <div className="gradient-primary rounded-2xl p-8 text-white relative overflow-hidden">
 <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
 <span className="text-5xl mb-4 block">🏥</span>
 <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Flat 25% Off</h3>
 <p className="text-sm text-white/80 mb-4">On your first order. Use code: ONEC25</p>
 <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 rounded-xl text-sm font-semibold hover:bg-white/90 transition-all">
 Shop Now <ArrowRight size={16} />
 </Link>
 </div>
 </FadeIn>
 <FadeIn delay={0.2}>
 <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden">
 <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
 <span className="text-5xl mb-4 block">📋</span>
 <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Free Delivery</h3>
 <p className="text-sm text-white/80 mb-4">On all prescription orders. No minimum order value.</p>
 <Link to="/prescription-upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-amber-700 rounded-xl text-sm font-semibold hover:bg-white/90 transition-all">
 Upload Prescription <ArrowRight size={16} />
 </Link>
 </div>
 </FadeIn>
 </div>
 </div>
 </section>

 {/* ===== TESTIMONIALS ===== */}
 <section className="py-12 px-4" style={{ background: 'var(--bg-surface)' }}>
 <div className="max-w-7xl mx-auto">
 <SlideUp>
 <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 What Our Customers Say
 </h2>
 <p className="text-sm text-center mb-8" style={{ color: 'var(--text-secondary)' }}>Trusted by 10 lakh+ happy customers</p>
 </SlideUp>

 <StaggerContainer className="grid md:grid-cols-3 gap-6">
 {testimonials.map((t, i) => (
 <StaggerItem key={i}>
 <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
 <div className="flex gap-1 mb-3">
 {Array.from({ length: 5 }).map((_, j) => (
 <Star key={j} size={14} className={j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
 ))}
 </div>
 <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
 {t.avatar}
 </div>
 <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</span>
 </div>
 </div>
 </StaggerItem>
 ))}
 </StaggerContainer>
 </div>
 </section>

 {/* ===== NEWSLETTER ===== */}
 <section className="py-16 px-4 gradient-primary">
 <div className="max-w-2xl mx-auto text-center text-white">
 <FadeIn>
 <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
 Stay Updated with Health Tips
 </h2>
 <p className="text-sm text-white/80 mb-6">Subscribe to our newsletter for exclusive offers and health insights</p>
 <div className="flex gap-3 max-w-md mx-auto">
 <input
 type="email"
 placeholder="Enter your email"
 className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 outline-none focus:border-white/50 text-sm backdrop-blur-sm"
 />
 <button className="px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold text-sm hover:bg-white/90 transition-all">
 Subscribe
 </button>
 </div>
 </FadeIn>
 </div>
 </section>
 </div>
 </PageTransition>
 );
}
