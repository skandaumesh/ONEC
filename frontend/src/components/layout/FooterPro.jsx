import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Pill, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube,
 Heart, Truck, Shield, Clock, ArrowUp, Send, Sparkles
} from 'lucide-react';

const FooterPro = () => {
 const currentYear = new Date().getFullYear();
 const [showScrollTop, setShowScrollTop] = useState(false);
 const [email, setEmail] = useState('');
 const [subscribed, setSubscribed] = useState(false);

 useEffect(() => {
 const handleScroll = () => setShowScrollTop(window.scrollY > 400);
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

 const handleSubscribe = (e) => {
 e.preventDefault();
 if (email.trim()) {
 setSubscribed(true);
 setEmail('');
 setTimeout(() => setSubscribed(false), 3000);
 }
 };

 const companyLinks = [
 { label: 'About Us', path: '/about' },
 { label: 'Careers', path: '#' },
 { label: 'Blog', path: '/blog' },
 { label: 'Partner with ONEC Pharma', path: '#' }
 ];

 const servicesLinks = [
 { label: 'Order Medicine', path: '/products' },
 { label: 'Healthcare Products', path: '/products' },
 { label: 'Lab Tests', path: '#' }
 ];

 const categoriesLinks = [
 { label: 'Must Haves', path: '/products' },
 { label: 'Vitamin Store', path: '/products?category=Vitamins' },
 { label: 'Personal Care', path: '/products' },
 { label: 'Sexual Wellness', path: '/products' },
 { label: 'Summer Store', path: '/products' },
 { label: 'Pet Care', path: '/products' },
 { label: 'Health Food and Drinks', path: '/products' },
 { label: 'Diabetes Essentials', path: '/products' },
 { label: 'Ayurvedic Care', path: '/products' },
 { label: 'Mother and Baby Care', path: '/products' },
 { label: 'Mobility & Elderly Care', path: '/products' },
 { label: 'Sports Nutrition', path: '/products' },
 { label: 'Healthcare Devices', path: '/products' },
 { label: 'Skin Care', path: '/products?category=Skincare' },
 { label: 'Health Concerns', path: '/products' },
 { label: 'Explore More', path: '/products' }
 ];

 const helpLinks = [
 { label: 'Browse All Medicines', path: '/products' },
 { label: 'Browse All Molecules', path: '/products' },
 { label: 'Browse All Cities', path: '#' },
 { label: 'Browse All Stores', path: '#' },
 { label: 'FAQs', path: '#' }
 ];

 const policyLinks = [
 { label: 'Editorial Policy', path: '#' },
 { label: 'Privacy Policy', path: '#' },
 { label: 'Vulnerability Disclosure Policy', path: '#' },
 { label: 'Terms and conditions', path: '#' },
 { label: 'Declaration on Dark Pattern', path: '#' },
 { label: 'Customer Support Policy', path: '#' },
 { label: 'Return Policy', path: '#' },
 { label: 'Smartbuy Policy', path: '#' }
 ];

 const features = [
 { icon: Truck, label: 'Free Delivery', desc: 'Orders above ₹499', color: 'text-blue-600 ', bg: 'bg-blue-500/10 ', hoverGlow: 'hover:border-blue-500/40 group-hover:shadow-[0_10px_35px_rgba(59,130,246,0.18)]_10px_35px_rgba(59,130,246,0.3)]' },
 { icon: Shield, label: 'Secure Payment', desc: '100% Safe & Secure', color: 'text-[#0D8D6C] ', bg: 'bg-[#0D8D6C]/10 #0D8D6C]/15', hoverGlow: 'hover:border-[#0D8D6C]/40 group-hover:shadow-[0_10px_35px_rgba(13,141,108,0.18)]_10px_35px_rgba(13,141,108,0.3)]' },
 { icon: Clock, label: '24/7 Support', desc: 'Always Available', color: 'text-[#7C3AED] ', bg: 'bg-purple-500/10 ', hoverGlow: 'hover:border-purple-500/40 group-hover:shadow-[0_10px_35px_rgba(124,58,237,0.18)]_10px_35px_rgba(124,58,237,0.3)]' },
 { icon: Heart, label: 'Certified Products', desc: 'Authentic & Verified', color: 'text-rose-600 ', bg: 'bg-rose-500/10 ', hoverGlow: 'hover:border-rose-500/40 group-hover:shadow-[0_10px_35px_rgba(244,63,94,0.18)]_10px_35px_rgba(244,63,94,0.3)]' }
 ];

 const socialLinks = [
 { icon: Instagram, label: 'Instagram', url: '#', hoverBg: 'hover:bg-[#E4405F]', hoverShadow: 'hover:shadow-[0_0_20px_rgba(228,64,95,0.4)]' },
 { icon: Facebook, label: 'Facebook', url: '#', hoverBg: 'hover:bg-[#1877F2]', hoverShadow: 'hover:shadow-[0_0_20px_rgba(24,119,242,0.4)]' },
 { icon: Youtube, label: 'Youtube', url: '#', hoverBg: 'hover:bg-[#FF0000]', hoverShadow: 'hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]' },
 { icon: Twitter, label: 'Twitter', url: '#', hoverBg: 'hover:bg-[#1DA1F2]', hoverShadow: 'hover:shadow-[0_0_20px_rgba(29,161,242,0.4)]' }
 ];

 const paymentMethods = [
 { name: 'GPay', logo: '📱 GPay', color: '#4285F4' },
 { name: 'Paytm', logo: '💸 Paytm', color: '#002970' },
 { name: 'Amazon Pay', logo: '📦 Pay', color: '#FF9900' },
 { name: 'PhonePe', logo: '💜 PhonePe', color: '#5F259F' },
 { name: 'MobiKwik', logo: '🔵 Mobi', color: '#005DF6' },
 { name: 'Airtel Money', logo: '🔴 Airtel', color: '#E11900' },
 { name: 'Freecharge', logo: '⚡ Free', color: '#FF5722' },
 { name: 'Ola Money', logo: '🚕 Ola', color: '#A3D82A' },
 { name: 'Visa', logo: '💳 Visa', color: '#1A1F71' },
 { name: 'Mastercard', logo: '🔴 Master', color: '#FF5F00' },
 { name: 'RuPay', logo: '🇮🇳 RuPay', color: '#0F58A5' },
 { name: 'Diners Club', logo: '⚜️ Diners', color: '#0079C1' }
 ];

 return (
 <>
 <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-color)]/60 mt-20 relative overflow-hidden">
 {/* Animated Mesh Gradient Top Strip */}
 <div className="w-full h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[#0D8D6C] to-[#102A43] bg-[length:200%_auto] animate-gradient-shift" />
 {/* Futuristic Ambient Blur Lights */}
 <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[var(--color-primary)]/4 rounded-full blur-3xl pointer-events-none animate-float-blob" />
 <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-[var(--color-secondary)]/4 rounded-full blur-3xl pointer-events-none animate-float-blob" style={{ animationDelay: '2.5s' }} />
 <div className="absolute inset-0 dot-grid-bg opacity-[0.15] pointer-events-none" />
 {/* Morphing Blobs */}
 <div className="morph-blob morph-blob-1" style={{ top: '20%', left: '5%', width: '200px', height: '200px', opacity: 0.15 }} />
 <div className="morph-blob morph-blob-2" style={{ bottom: '10%', right: '5%', width: '180px', height: '180px', opacity: 0.12 }} />

 {/* 1. Features Grid - Premium Glassmorphism Cards */}
 <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 relative z-10">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {features.map(({ icon: Icon, label, desc, color, bg, hoverGlow }, idx) => (
 <motion.div
 key={label}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.08, type: 'spring', stiffness: 100 }}
 className={`flex items-center gap-4 p-5 rounded-3xl border border-[var(--border-color)]/50 bg-[var(--bg-surface-secondary)]/50 backdrop-blur-md shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1.5 group glass-noise transition-all duration-305 ${hoverGlow}`}
 >
 <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
 <Icon size={22} className={color} />
 </div>
 <div>
 <h4 className="font-bold text-sm text-[var(--text-primary)]">{label}</h4>
 <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">{desc}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>

 {/* 2. Newsletter Banner - Unified Pill Form Redesign */}
 <div className="border-y border-[var(--border-color)]/50 bg-[var(--bg-surface-secondary)]/30 backdrop-blur-sm relative z-10">
 <div className="max-w-7xl mx-auto px-6 py-10">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="flex flex-col lg:flex-row items-center justify-between gap-8"
 >
 {/* Text Callout */}
 <div className="flex items-center gap-4 text-center lg:text-left flex-col sm:flex-row">
 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white shadow-md flex-shrink-0 animate-pulse-slow">
 <Sparkles size={22} className="flex-shrink-0" />
 </div>
 <div className="flex-1 min-w-0 text-center sm:text-left">
 <h3 className="font-bold text-base text-[var(--text-primary)] leading-tight flex items-center justify-center sm:justify-start gap-2 flex-wrap">
 Stay Updated with Health Tips
 <span className="text-[10px] font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded-full border border-[var(--color-primary)]/20 uppercase tracking-wider">
 Newsletter
 </span>
 </h3>
 <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
 Subscribe to our newsletter for exclusive deals, wellness advice & medicine reminders
 </p>
 </div>
 </div>

 {/* Structurally Bulletproof Unified Pill Form */}
 <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
 <div className="relative flex items-center bg-[var(--bg-primary)] border border-[var(--border-color)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/15 rounded-2xl p-1.5 w-full sm:w-[450px] transition-all duration-300 shadow-sm hover:border-[var(--color-primary)]/40 focus-within:shadow-md">
 <Mail size={18} className="ml-3 text-[var(--text-muted)] flex-shrink-0" />
 <input
 type="email"
 placeholder="Enter your email address"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="flex-grow flex-1 min-w-0 bg-transparent border-none outline-none text-sm px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-0 focus:outline-none"
 required
 />
 <motion.button
 type="submit"
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg hover:brightness-110 transition-all flex-shrink-0 cursor-pointer btn-shine"
 >
 {subscribed ? (
 <>✓ Subscribed</>
 ) : (
 <>
 <Send size={12} /> Subscribe
 </>
 )}
 </motion.button>
 </div>
 </form>
 </motion.div>
 </div>
 </div>

 {/* 3. Main Link Columns & Brand Details */}
 <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
 {/* Column 1: Company & Our Services */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="flex flex-col gap-8"
 >
 <div>
 <h4 className="font-bold text-xs uppercase tracking-wider mb-5 text-[var(--text-primary)] border-b border-[var(--border-color)]/40 pb-2">
 Company
 </h4>
 <ul className="space-y-3">
 {companyLinks.map(({ label, path }) => (
 <li key={label}>
 <Link
 to={path}
 className="text-xs text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium underline-animation pb-1"
 >
 {label}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 <div>
 <h4 className="font-bold text-xs uppercase tracking-wider mb-5 text-[var(--text-primary)] border-b border-[var(--border-color)]/40 pb-2">
 Our Services
 </h4>
 <ul className="space-y-3">
 {servicesLinks.map(({ label, path }) => (
 <li key={label}>
 <Link
 to={path}
 className="text-xs text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium underline-animation pb-1"
 >
 {label}
 </Link>
 </li>
 ))}
 </ul>
 </div>
 </motion.div>

 {/* Column 2: Featured Categories (Compact 2-Column Grid) */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.05 }}
 className="lg:col-span-2"
 >
 <h4 className="font-bold text-xs uppercase tracking-wider mb-5 text-[var(--text-primary)] border-b border-[var(--border-color)]/40 pb-2">
 Featured Categories
 </h4>
 <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
 {categoriesLinks.map(({ label, path }) => (
 <li key={label}>
 <Link
 to={path}
 className="text-xs text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium underline-animation pb-1"
 >
 {label}
 </Link>
 </li>
 ))}
 </ul>
 </motion.div>

 {/* Column 3: Need Help & Policy Info */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className="flex flex-col gap-8"
 >
 <div>
 <h4 className="font-bold text-xs uppercase tracking-wider mb-5 text-[var(--text-primary)] border-b border-[var(--border-color)]/40 pb-2">
 Need Help
 </h4>
 <ul className="space-y-3">
 {helpLinks.map(({ label, path }) => (
 <li key={label}>
 <Link
 to={path}
 className="text-xs text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium underline-animation pb-1"
 >
 {label}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 <div>
 <h4 className="font-bold text-xs uppercase tracking-wider mb-5 text-[var(--text-primary)] border-b border-[var(--border-color)]/40 pb-2">
 Policy Info
 </h4>
 <ul className="space-y-3">
 {policyLinks.map(({ label, path }) => (
 <li key={label}>
 <Link
 to={path}
 className="text-xs text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium underline-animation pb-1"
 >
 {label}
 </Link>
 </li>
 ))}
 </ul>
 </div>
 </motion.div>

 {/* Column 4: Follow Us On */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.15 }}
 >
 <h4 className="font-bold text-xs uppercase tracking-wider mb-5 text-[var(--text-primary)] border-b border-[var(--border-color)]/40 pb-2">
 Follow Us On
 </h4>
 <div className="flex items-center gap-3">
 {socialLinks.map(({ icon: Icon, label, url, hoverBg, hoverShadow }) => (
 <motion.a
 key={label}
 href={url}
 whileHover={{ scale: 1.15, y: -2 }}
 whileTap={{ scale: 0.95 }}
 className={`w-9 h-9 rounded-full bg-[var(--bg-surface-secondary)] border border-[var(--border-color)]/60 flex items-center justify-center ${hoverBg} hover:text-white ${hoverShadow} transition-all duration-300 text-[var(--text-secondary)] social-neon`}
 title={label}
 >
 <Icon size={15} />
 </motion.a>
 ))}
 </div>
 </motion.div>
 </div>

 <div className="border-t border-[var(--border-color)]/50 pt-8" />

 {/* 4. Bottom Row - Alignment & Aesthetics Redesign */}
 <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
 {/* Certified Payments Frame Redesign */}
 <div className="flex flex-col sm:flex-row items-center gap-4">
 <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider mr-1">
 Our Payment Partners
 </span>
 <div className="flex gap-1.5 flex-wrap justify-center sm:justify-start">
 {paymentMethods.map(({ name, logo, color }) => (
 <div
 key={name}
 className="h-7 px-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-secondary)]/50 backdrop-blur-md flex items-center gap-1 text-[9px] font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:bg-[var(--bg-surface)]"
 style={{ borderLeft: `3px solid ${color}` }}
 title={name}
 >
 <span>{logo}</span>
 <span className="text-[var(--text-primary)] font-semibold">{name}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Copyright */}
 <p className="text-[11px] text-[var(--text-muted)] font-semibold whitespace-nowrap mt-4 lg:mt-0">
 © {currentYear} ONEC Pharma. All Rights Reserved
 </p>
 </div>
 </div>

 {/* 5. Health Compliance & Regulatory Disclaimer Banner */}
 <div className="bg-[var(--bg-surface-secondary)] border-t border-[var(--border-color)]/50 py-5 relative z-10">
 <div className="max-w-7xl mx-auto px-6">
 <div className="flex flex-col md:flex-row items-center justify-between gap-4">
 <div className="flex flex-wrap justify-center gap-4 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
 <motion.span whileHover={{ scale: 1.05, y: -1 }} className="flex items-center gap-1 text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-3 py-1 rounded-full border border-[var(--color-secondary)]/20 shadow-sm cursor-default">
 🛡️ HIPAA COMPLIANT
 </motion.span>
 <motion.span whileHover={{ scale: 1.05, y: -1 }} className="flex items-center gap-1 text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full border border-[var(--color-primary)]/20 shadow-sm cursor-default">
 ✓ FDA APPROVED APOTHECARY
 </motion.span>
 <motion.span whileHover={{ scale: 1.05, y: -1 }} className="flex items-center gap-1 text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-3 py-1 rounded-full border border-[var(--color-accent)]/20 shadow-sm cursor-default">
 ⚙️ ISO 9001 CERTIFIED
 </motion.span>
 </div>
 <p className="text-[10px] text-[var(--text-muted)] text-center md:text-right leading-relaxed max-w-2xl font-medium">
 Disclaimer: All prescription pharmaceutical products are distributed strictly in compliance with applicable healthcare statutes. 
 A valid medical prescription from a registered clinical practitioner is mandatory. Consult a healthcare professional before use.
 </p>
 </div>
 </div>
 </div>
 </footer>

 {/* 6. Scroll to Top Button - Positioned Sleekly next to Floating Chatbot */}
 <AnimatePresence>
 {showScrollTop && (
 <motion.button
 initial={{ opacity: 0, scale: 0.6, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.6, y: 10 }}
 whileHover={{ scale: 1.1, y: -2 }}
 whileTap={{ scale: 0.9 }}
 onClick={scrollToTop}
 className="fixed bottom-8 right-28 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-[var(--color-primary)]/20 transition-all border border-white/20 cursor-pointer"
 title="Scroll to Top"
 >
 <ArrowUp size={20} />
 </motion.button>
 )}
 </AnimatePresence>
 </>
 );
};

export default FooterPro;
