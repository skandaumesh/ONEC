import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import NavbarPro from './components/layout/NavbarPro';

import CartDrawer from './components/layout/CartDrawer';
import ToastContainer from './components/ToastProvider';
import AIChatbotPro from './components/AIChatbotPro';
import { LoadingSpinner } from './components/common/LoadingStates';

import { motion, AnimatePresence } from 'framer-motion';

// Pages
import HomePagePro from './pages/HomePagePro';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import PrescriptionUploadPage from './pages/PrescriptionUploadPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Route wrapper
function ProtectedRoute({ children }) {
 const { isAuthenticated, loading } = useAuth();
 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <LoadingSpinner size="lg" message="Loading..." />
 </div>
 );
 }
 return isAuthenticated ? children : <Navigate to="/login" />;
}

// Admin Route wrapper
function AdminRoute({ children }) {
 const { isAdmin, loading } = useAuth();
 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <LoadingSpinner size="lg" message="Loading..." />
 </div>
 );
 }
 return isAdmin ? children : <Navigate to="/" />;
}

function NotFoundPage() {
 return (
 <div className="min-h-[75vh] flex items-center justify-center px-4 relative overflow-hidden">
 {/* Background decoration */}
 <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-secondary)]/5 rounded-full blur-3xl pointer-events-none" />
 <div className="absolute inset-0 dot-grid-bg opacity-30" />
 
 <div className="text-center relative z-10">
 {/* Floating Pill Capsule */}
 <div className="float-pill mb-8 inline-block">
 <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center shadow-2xl mx-auto gradient-border-spin">
 <span className="text-white text-4xl font-black">💊</span>
 </div>
 </div>

 {/* Glitch 404 Text */}
 <h1 className="text-8xl md:text-9xl font-black mb-4 tracking-tighter gradient-text-vivid select-none">
 404
 </h1>

 <h2 className="text-xl md:text-2xl font-bold mb-3 text-[var(--text-primary)]">
 Oops! Page Not Found
 </h2>
 <p className="text-sm mb-8 max-w-md mx-auto text-[var(--text-secondary)] leading-relaxed">
 The page you're looking for doesn't exist or has been moved. Let's get you back on track.
 </p>

 {/* Quick Links */}
 <div className="flex flex-wrap justify-center gap-3 mb-8">
 {[
 { label: 'Products', href: '/products' },
 { label: 'About Us', href: '/about' },
 { label: 'Contact', href: '/contact' },
 ].map(link => (
 <a
 key={link.label}
 href={link.href}
 className="px-4 py-2 rounded-full text-xs font-semibold glass-surface hover-glow text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-all"
 >
 {link.label}
 </a>
 ))}
 </div>

 {/* Go Home Button */}
 <a
 href="/"
 className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-bold text-sm hover:shadow-xl hover:scale-105 transition-all pulse-border"
 >
 ← Take Me Home
 </a>
 </div>
 </div>
 );
}

// Animated route wrapper
function AnimatedRoutes() {
 const location = useLocation();

 return (
 <AnimatePresence mode="wait">
 <motion.div
 key={location.pathname}
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8 }}
 transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
 >
 <Routes location={location}>
 {/* Public Routes */}
 <Route path="/" element={<HomePagePro />} />
 <Route path="/products" element={<ProductsPage />} />
 <Route path="/products/:id" element={<ProductDetailPage />} />
 <Route path="/login" element={<LoginPage />} />
 <Route path="/register" element={<RegisterPage />} />
 <Route path="/forgot-password" element={<ForgotPasswordPage />} />
 <Route path="/about" element={<AboutPage />} />
 <Route path="/contact" element={<ContactPage />} />
 <Route path="/blog" element={<BlogPage />} />

 {/* Protected Routes */}
 <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
 <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
 <Route path="/cart" element={<ProtectedRoute><Navigate to="/" /></ProtectedRoute>} />
 <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
 <Route path="/prescription-upload" element={<ProtectedRoute><PrescriptionUploadPage /></ProtectedRoute>} />

 {/* Admin Routes */}
 <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
 <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

 {/* 404 */}
 <Route path="*" element={<NotFoundPage />} />
 </Routes>
 </motion.div>
 </AnimatePresence>
 );
}

function AppContent() {
 return (
 <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">

 <NavbarPro />
 <main className="flex-1">
 <ErrorBoundary>
 <AnimatedRoutes />
 </ErrorBoundary>
 </main>

 <CartDrawer />
 <AIChatbotPro />
 </div>
 );
}

export default function App() {
 return (
 <Router>
 <ThemeProvider>
 <AuthProvider>
 <CartProvider>
 <ToastProvider>
 <AppContent />
 <ToastContainer />
 </ToastProvider>
 </CartProvider>
 </AuthProvider>
 </ThemeProvider>
 </Router>
 );
}
