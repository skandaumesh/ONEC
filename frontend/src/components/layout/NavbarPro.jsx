import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import {
 Search, ShoppingCart, User, Menu, X, Sun, Moon,
 Package, LogOut, ChevronDown, Pill, LayoutDashboard
} from 'lucide-react';

const NAV_LINKS = [
 { label: 'Products', path: '/products' },
 { label: 'About', path: '/about' },
 { label: 'Contact', path: '/contact' },
 { label: 'Blog', path: '/blog' },
];

const Navbar = () => {
 const { user, isAuthenticated, isAdmin, logout } = useAuth();
 const { itemCount, setCartOpen } = useCart();
 const { theme, toggleTheme } = useTheme();
 const navigate = useNavigate();
 const location = useLocation();

 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');
 const [searchOpen, setSearchOpen] = useState(false);
 const [isScrolled, setIsScrolled] = useState(false);
 const searchInputRef = useRef(null);
 const profileRef = useRef(null);

 useEffect(() => {
 const handleScroll = () => setIsScrolled(window.scrollY > 10);
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 // Close profile dropdown when clicking outside
 useEffect(() => {
 const handleClickOutside = (e) => {
 if (profileRef.current && !profileRef.current.contains(e.target)) {
 setProfileDropdownOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 // Close mobile menu on route change
 useEffect(() => {
 setMobileMenuOpen(false);
 setSearchOpen(false);
 }, [location.pathname]);

 const handleSearch = useCallback((e) => {
 e.preventDefault();
 if (searchQuery.trim()) {
 navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
 setSearchQuery('');
 setSearchOpen(false);
 }
 }, [searchQuery, navigate]);

 const handleLogout = useCallback(() => {
 logout();
 navigate('/');
 setProfileDropdownOpen(false);
 setMobileMenuOpen(false);
 }, [logout, navigate]);

 return (
 <header className={clsx(
 "sticky top-0 z-50 w-full transition-all duration-300",
 isScrolled
 ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/60 "
 : "bg-white border-b border-slate-100 "
 )}>
 <div className="max-w-7xl mx-auto px-4 md:px-6">
 <div className="flex items-center justify-between h-16 gap-4">

 {/* Logo */}
 <Link to="/" className="flex items-center gap-2.5 group shrink-0">
 <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow duration-300">
 <Pill size={18} />
 </div>
 <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
 ONEC<span className="text-[var(--color-primary)]">Pharma</span>
 </h1>
 </Link>

 {/* Desktop Nav Links */}
 <nav className="hidden md:flex items-center gap-1">
 {NAV_LINKS.map(({ label, path }) => {
 const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
 return (
 <Link
 key={label}
 to={path}
 className={clsx(
 "px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200",
 isActive
 ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5"
 : "text-slate-600 hover:text-[var(--color-primary)] hover:bg-slate-50"
 )}
 >
 {label}
 </Link>
 );
 })}
 </nav>

 {/* Desktop Search */}
 <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm relative">
 <div className="w-full relative">
 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
 <input
 ref={searchInputRef}
 type="search"
 placeholder="Search medicines..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all duration-200 text-slate-700 placeholder-slate-400"
 />
 </div>
 </form>

 {/* Right Actions */}
 <div className="flex items-center gap-1.5 shrink-0">

 {/* Mobile Search Toggle */}
 <button
 onClick={() => setSearchOpen(!searchOpen)}
 className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
 >
 <Search size={18} className="text-slate-600 " />
 </button>

 {/* Theme Toggle */}
 <button
 onClick={toggleTheme}
 className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
 title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
 >
 {theme === 'light'
 ? <Moon size={18} className="text-slate-600" />
 : <Sun size={18} className="text-amber-400" />
 }
 </button>

 {/* Cart */}
 <button
 onClick={() => setCartOpen(true)}
 className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
 >
 <ShoppingCart size={18} className="text-slate-600 " />
 {itemCount > 0 && (
 <span className="absolute -top-0.5 -right-0.5 bg-[var(--color-primary)] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">
 {itemCount}
 </span>
 )}
 </button>

 {/* Auth */}
 {isAuthenticated ? (
 <div className="relative" ref={profileRef}>
 <button
 onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
 className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
 >
 <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
 <User size={14} className="text-[var(--color-primary)]" />
 </div>
 <ChevronDown size={12} className="text-slate-400 hidden sm:block" />
 </button>

 <AnimatePresence>
 {profileDropdownOpen && (
 <motion.div
 initial={{ opacity: 0, y: 6, scale: 0.97 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 6, scale: 0.97 }}
 transition={{ duration: 0.15 }}
 className="absolute right-0 mt-2 w-52 bg-white #141D2F] border border-slate-200 rounded-xl shadow-xl py-1 z-50 overflow-hidden"
 >
 <div className="px-4 py-3 border-b border-slate-100 ">
 <p className="font-bold text-sm text-slate-800 truncate">{user?.name || 'User'}</p>
 <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
 </div>
 <Link
 to="/profile"
 className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
 onClick={() => setProfileDropdownOpen(false)}
 >
 <User size={15} /> My Profile
 </Link>
 <Link
 to="/orders"
 className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
 onClick={() => setProfileDropdownOpen(false)}
 >
 <Package size={15} /> My Orders
 </Link>
 {isAdmin && (
 <Link
 to="/admin"
 className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)] transition-colors"
 onClick={() => setProfileDropdownOpen(false)}
 >
 <LayoutDashboard size={15} /> Admin Panel
 </Link>
 )}
 <div className="border-t border-slate-100 mt-1">
 <button
 onClick={handleLogout}
 className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
 >
 <LogOut size={15} /> Logout
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 ) : (
 <div className="flex gap-2 ml-1">
 <button
 onClick={() => navigate('/login')}
 className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
 >
 Login
 </button>
 <button
 onClick={() => navigate('/register')}
 className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
 >
 Register
 </button>
 </div>
 )}

 {/* Mobile Menu Toggle */}
 <button
 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
 >
 {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
 </button>
 </div>
 </div>

 {/* Mobile Search Bar (expandable) */}
 <AnimatePresence>
 {searchOpen && (
 <motion.form
 onSubmit={handleSearch}
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="md:hidden overflow-hidden pb-3"
 >
 <div className="relative">
 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="search"
 placeholder="Search medicines..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 autoFocus
 className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--color-primary)] transition-colors"
 />
 </div>
 </motion.form>
 )}
 </AnimatePresence>
 </div>

 {/* Mobile Menu */}
 <AnimatePresence>
 {mobileMenuOpen && (
 <motion.nav
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.2 }}
 className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
 >
 <div className="px-4 py-3 space-y-1">
 {NAV_LINKS.map(({ label, path }) => {
 const isActive = location.pathname === path;
 return (
 <Link
 key={label}
 to={path}
 onClick={() => setMobileMenuOpen(false)}
 className={clsx(
 "block px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
 isActive
 ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5"
 : "text-slate-700 hover:bg-slate-50"
 )}
 >
 {label}
 </Link>
 );
 })}
 </div>
 </motion.nav>
 )}
 </AnimatePresence>
 </header>
 );
};

export default Navbar;
