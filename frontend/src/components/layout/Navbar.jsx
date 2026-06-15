import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import {
 Search, ShoppingCart, User, Menu, X, Sun, Moon,
 Heart, Package, LogOut, ChevronDown, Phone, MapPin,
 Upload, LayoutDashboard, Pill, Sparkles
} from 'lucide-react';

export default function Navbar() {
 const { user, isAuthenticated, isAdmin, logout } = useAuth();
 const { itemCount, setCartOpen } = useCart();
 const { theme, toggleTheme } = useTheme();
 const navigate = useNavigate();
 const [scrolled, setScrolled] = useState(false);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [profileOpen, setProfileOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');
 const [searchFocused, setSearchFocused] = useState(false);

 useEffect(() => {
 const handleScroll = () => setScrolled(window.scrollY > 20);
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const handleSearch = (e) => {
 e.preventDefault();
 if (searchQuery.trim()) {
 navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
 setSearchQuery('');
 }
 };

 const handleLogout = () => {
 logout();
 navigate('/');
 setProfileOpen(false);
 };

 const categories = [
 { name: 'Medicines', path: '/products?category=1' },
 { name: 'Wellness', path: '/products?category=2' },
 { name: 'Personal Care', path: '/products?category=3' },
 { name: 'Healthcare Devices', path: '/products?category=4' },
 { name: 'Vitamins', path: '/products?category=5' },
 { name: 'Ayurveda', path: '/products?category=6' },
 { name: 'Diabetes Care', path: '/products?category=7' },
 ];

 return (
 <>
 {/* Top Info Bar */}
 <div className="hidden md:block w-full text-white text-xs py-1.5 gradient-primary">
 <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
 <div className="flex items-center gap-4">
 <span className="flex items-center gap-1"><Phone size={12} /> +91 1800-xxx-xxxx</span>
 <span className="flex items-center gap-1"><MapPin size={12} /> Free delivery on orders above ₹499</span>
 </div>
 <div className="flex items-center gap-4">
 <Link to="/prescription-upload" className="hover:underline flex items-center gap-1">
 <Upload size={12} /> Upload Prescription
 </Link>
 <span>|</span>
 <Link to="/about" className="hover:underline">About</Link>
 <Link to="/contact" className="hover:underline">Contact</Link>
 </div>
 </div>
 </div>

 {/* Main Navbar */}
 <header
 className={`sticky top-0 z-50 w-full transition-all duration-300 ${
 scrolled
 ? 'shadow-lg backdrop-blur-xl bg-[var(--bg-surface)]/90'
 : 'bg-[var(--bg-surface)]'
 }`}
 style={{ borderBottom: '1px solid var(--border-color)' }}
 >
 <div className="max-w-7xl mx-auto px-4">
 <div className="flex items-center justify-between h-16">
 {/* Logo */}
 <Link to="/" className="flex items-center gap-2 shrink-0">
 <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
 <span className="text-white font-bold text-lg font-[var(--font-heading)]">O</span>
 </div>
 <div className="hidden sm:block">
 <span className="text-xl font-bold font-[var(--font-heading)] gradient-text">ONEC</span>
 <span className="text-xl font-light font-[var(--font-heading)]" style={{ color: 'var(--text-secondary)' }}> Pharma</span>
 </div>
 </Link>

 {/* Search Bar & Command Suggestions */}
 <div className="hidden md:block flex-1 max-w-xl mx-8 relative z-20">
 <form onSubmit={handleSearch} className="flex w-full">
 <div className="relative w-full">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 onFocus={() => setSearchFocused(true)}
 placeholder="Search medicines, health products..."
 className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/30"
 style={{
 background: 'var(--bg-surface-hover)',
 color: 'var(--text-primary)',
 border: '1px solid var(--border-color)',
 }}
 />
 </div>
 </form>

 {/* Suggestions Command Palette */}
 <AnimatePresence>
 {searchFocused && (
 <>
 {/* Overlay to click away */}
 <div className="fixed inset-0 z-10" onClick={() => setSearchFocused(false)} />
 
 <motion.div
 initial={{ opacity: 0, y: 15, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
 className="absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl p-5 z-20"
 style={{
 background: 'var(--bg-surface)',
 border: '1px solid var(--border-color)',
 backdropFilter: 'blur(12px)',
 boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
 }}
 >
 {/* Section: Trending Searches */}
 <div className="mb-4">
 <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1 mb-2" style={{ color: 'var(--text-muted)' }}>
 🔥 Trending Searches
 </span>
 <div className="flex flex-wrap gap-2">
 {[
 { name: 'Dolo 650', query: 'Dolo 650mg' },
 { name: 'Himalaya Liv.52', query: 'Himalaya Liv.52' },
 { name: 'Centrum Multivitamin', query: 'Centrum Multivitamin' },
 { name: 'Accu-Chek', query: 'Accu-Chek' }
 ].map(item => (
 <button
 key={item.name}
 type="button"
 onClick={() => {
 setSearchQuery(item.query);
 navigate(`/products?search=${encodeURIComponent(item.query)}`);
 setSearchFocused(false);
 }}
 className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:bg-primary hover:text-white cursor-pointer"
 style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
 >
 {item.name}
 </button>
 ))}
 </div>
 </div>

 {/* Section: Categories */}
 <div className="mb-4 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
 <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1 mb-2" style={{ color: 'var(--text-muted)' }}>
 📦 Popular Categories
 </span>
 <div className="grid grid-cols-2 gap-2">
 {[
 { name: 'Medicines', icon: <Pill size={14} className="text-emerald-500" />, path: '/products?category=1' },
 { name: 'Wellness', icon: <Heart size={14} className="text-pink-500" />, path: '/products?category=2' },
 { name: 'Devices', icon: <Sparkles size={14} className="text-purple-500" />, path: '/products?category=4' },
 { name: 'Vitamins', icon: <Sparkles size={14} className="text-amber-500" />, path: '/products?category=5' },
 ].map(cat => (
 <Link
 key={cat.name}
 to={cat.path}
 onClick={() => setSearchFocused(false)}
 className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium hover:bg-primary/10 transition-colors"
 style={{ color: 'var(--text-primary)' }}
 >
 <div className="p-1.5 rounded-lg bg-[var(--bg-surface-hover)]">
 {cat.icon}
 </div>
 {cat.name}
 </Link>
 ))}
 </div>
 </div>

 {/* Section: Pro Tip */}
 <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 text-xs text-primary font-medium">
 <Sparkles size={14} className="shrink-0" />
 <span>Try uploading a prescription and our AI will automatically fetch the medicines for you!</span>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </div>

 {/* Actions */}
 <div className="flex items-center gap-2">
 {/* Theme Toggle */}
 <motion.button
 whileHover={{ scale: 1.1 }}
 whileTap={{ scale: 0.9 }}
 onClick={toggleTheme}
 className="p-2 rounded-xl transition-colors hover:bg-[var(--bg-surface-hover)] cursor-pointer"
 aria-label="Toggle theme"
 >
 <motion.div
 key={theme}
 initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
 animate={{ rotate: 0, scale: 1, opacity: 1 }}
 transition={{ type: 'spring', stiffness: 200, damping: 15 }}
 >
 {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-500" />}
 </motion.div>
 </motion.button>

 {/* Cart */}
 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => isAuthenticated ? setCartOpen(true) : navigate('/login')}
 className="relative p-2 rounded-xl transition-colors hover:bg-[var(--bg-surface-hover)] cursor-pointer"
 aria-label="Cart"
 >
 <ShoppingCart size={20} style={{ color: 'var(--text-secondary)' }} />
 {itemCount > 0 && (
 <motion.span
 initial={{ scale: 0 }}
 animate={{ scale: [0, 1.25, 1] }}
 key={itemCount}
 transition={{ type: 'spring', stiffness: 500, damping: 15 }}
 className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-semibold shadow-glow"
 >
 {itemCount}
 </motion.span>
 )}
 </motion.button>

 {/* Auth / Profile */}
 {isAuthenticated ? (
 <div className="relative">
 <button
 onClick={() => setProfileOpen(!profileOpen)}
 className="flex items-center gap-2 p-2 rounded-xl transition-colors hover:bg-[var(--bg-surface-hover)]"
 >
 <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
 {user?.firstName?.charAt(0) || 'U'}
 </div>
 <span className="hidden lg:block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
 {user?.firstName}
 </span>
 <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
 </button>

 <AnimatePresence>
 {profileOpen && (
 <motion.div
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 transition={{ duration: 0.15 }}
 className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl overflow-hidden z-50"
 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
 >
 <div className="p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
 <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.firstName} {user?.lastName}</p>
 <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
 </div>
 <div className="py-1">
 {isAdmin && (
 <Link to="/admin" onClick={() => setProfileOpen(false)}
 className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-surface-hover)] transition-colors"
 style={{ color: 'var(--text-primary)' }}>
 <LayoutDashboard size={16} /> Admin Dashboard
 </Link>
 )}
 <Link to="/profile" onClick={() => setProfileOpen(false)}
 className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-surface-hover)] transition-colors"
 style={{ color: 'var(--text-primary)' }}>
 <User size={16} /> My Profile
 </Link>
 <Link to="/orders" onClick={() => setProfileOpen(false)}
 className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-surface-hover)] transition-colors"
 style={{ color: 'var(--text-primary)' }}>
 <Package size={16} /> My Orders
 </Link>
 <button onClick={handleLogout}
 className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--bg-surface-hover)] transition-colors w-full text-left text-red-500">
 <LogOut size={16} /> Logout
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Click-away overlay */}
 {profileOpen && (
 <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
 )}
 </div>
 ) : (
 <div className="flex items-center gap-2">
 <Link to="/login"
 className="hidden sm:block text-sm font-medium px-4 py-2 rounded-xl transition-colors hover:bg-[var(--bg-surface-hover)]"
 style={{ color: 'var(--text-primary)' }}>
 Login
 </Link>
 <Link to="/register"
 className="text-sm font-semibold px-4 py-2 rounded-xl text-white gradient-primary hover:opacity-90 transition-opacity">
 Sign Up
 </Link>
 </div>
 )}

 {/* Mobile Menu Toggle */}
 <button
 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 className="md:hidden p-2 rounded-xl hover:bg-[var(--bg-surface-hover)]"
 >
 {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
 </button>
 </div>
 </div>

 {/* Category Nav (Desktop) */}
 <nav className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto">
 {categories.map((cat) => (
 <motion.div key={cat.name} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
 <Link
 to={cat.path}
 className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary whitespace-nowrap block"
 style={{ color: 'var(--text-secondary)' }}
 >
 {cat.name}
 </Link>
 </motion.div>
 ))}
 </nav>
 </div>

 {/* Mobile Menu */}
 <AnimatePresence>
 {mobileMenuOpen && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="md:hidden overflow-hidden"
 style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}
 >
 <div className="p-4 space-y-3">
 <form onSubmit={handleSearch} className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search medicines..."
 className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
 style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
 />
 </form>
 {categories.map((cat) => (
 <Link key={cat.name} to={cat.path} onClick={() => setMobileMenuOpen(false)}
 className="block px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--text-secondary)' }}>
 {cat.name}
 </Link>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </header>
 </>
 );
}
