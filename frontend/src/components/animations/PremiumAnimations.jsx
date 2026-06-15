import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

/**
 * ⚡ Premium Hero Section with Parallax & Gradient
 */
export function HeroSection({ children, title, subtitle, backgroundImage, className = '' }) {
 const containerRef = useRef(null);
 const { scrollY } = useScroll();
 const y = useTransform(scrollY, [0, 300], [0, 100]);

 return (
 <motion.section
 ref={containerRef}
 className={`relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-primary ${className}`}
 >
 {/* Animated Background Gradient */}
 <motion.div
 className="absolute inset-0 bg-gradient-animated opacity-60"
 style={{ y }}
 />

 {/* Floating Blobs */}
 <div className="absolute inset-0 overflow-hidden">
 <motion.div
 className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
 animate={{
 x: [0, 100, -50, 0],
 y: [0, -100, 50, 0],
 }}
 transition={{ duration: 20, repeat: Infinity }}
 style={{ top: '10%', left: '10%' }}
 />
 <motion.div
 className="absolute w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
 animate={{
 x: [0, -100, 50, 0],
 y: [0, 100, -50, 0],
 }}
 transition={{ duration: 20, repeat: Infinity }}
 style={{ bottom: '10%', right: '10%' }}
 />
 </div>

 {/* Content */}
 <motion.div
 className="relative z-10 text-center text-white max-w-4xl px-6"
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, ease: 'easeOut' }}
 >
 {title && (
 <motion.h1
 className="text-5xl md:text-7xl font-bold mb-6"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, delay: 0.2 }}
 >
 {title}
 </motion.h1>
 )}
 {subtitle && (
 <motion.p
 className="text-xl md:text-2xl mb-8 text-blue-100"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 0.8, delay: 0.4 }}
 >
 {subtitle}
 </motion.p>
 )}
 {children}
 </motion.div>

 {/* Scroll Indicator */}
 <motion.div
 className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
 animate={{ y: [0, 10, 0] }}
 transition={{ duration: 2, repeat: Infinity }}
 >
 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
 </svg>
 </motion.div>
 </motion.section>
 );
}

/**
 * ✨ Glowing Gradient Card with Hover Effects
 */
export function GlowingCard({ children, className = '', gradient = 'primary' }) {
 const ref = useRef(null);
 const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

 const handleMouseMove = (e) => {
 const rect = ref.current?.getBoundingClientRect();
 if (rect) {
 setMousePosition({
 x: e.clientX - rect.left,
 y: e.clientY - rect.top,
 });
 }
 };

 const gradientVariants = {
 primary: 'from-blue-500/10 via-transparent to-green-500/10',
 secondary: 'from-green-500/10 via-transparent to-blue-500/10',
 accent: 'from-amber-500/10 via-transparent to-orange-500/10',
 };

 return (
 <motion.div
 ref={ref}
 onMouseMove={handleMouseMove}
 className={`relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl ${className}`}
 whileHover={{ scale: 1.02 }}
 transition={{ type: 'spring', stiffness: 400, damping: 25 }}
 >
 {/* Gradient Background */}
 <div className={`absolute inset-0 bg-gradient-to-br ${gradientVariants[gradient]}`} />

 {/* Mouse-Following Glow */}
 <motion.div
 className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
 style={{
 background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
 }}
 />

 {/* Content */}
 <div className="relative z-10">
 {children}
 </div>

 {/* Border Glow */}
 <motion.div
 className="absolute inset-0 border border-transparent rounded-2xl"
 style={{
 borderColor: `rgba(59, 130, 246, ${0.2 * (1 - Math.hypot(mousePosition.x - 150, mousePosition.y - 150) / 300)})`,
 }}
 />
 </motion.div>
 );
}

/**
 * 🎯 Feature Card with Icon Animation
 */
export function AnimatedFeatureCard({ icon: Icon, title, description, delay = 0 }) {
 const ref = useRef(null);
 const isInView = useInView(ref, { once: true, margin: '-50px' });

 return (
 <motion.div
 ref={ref}
 className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300"
 initial={{ opacity: 0, y: 30 }}
 animate={isInView ? { opacity: 1, y: 0 } : {}}
 transition={{ duration: 0.6, delay }}
 whileHover={{ y: -10, scale: 1.02 }}
 >
 {/* Glow Background */}
 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl bg-gradient-to-r from-blue-500/10 to-green-500/10 blur-lg" />

 {/* Icon Container */}
 <motion.div
 className="relative w-16 h-16 mb-6 flex items-center justify-center rounded-xl bg-gradient-primary text-white shadow-lg"
 whileHover={{ rotate: 360, scale: 1.1 }}
 transition={{ duration: 0.6 }}
 >
 <Icon size={32} />
 </motion.div>

 {/* Title */}
 <h3 className="relative text-xl font-bold mb-3 text-white">{title}</h3>

 {/* Description */}
 <p className="relative text-gray-300 leading-relaxed">{description}</p>

 {/* Border Accent */}
 <motion.div
 className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
 whileHover={{ width: '100%' }}
 transition={{ duration: 0.3 }}
 />
 </motion.div>
 );
}

/**
 * 💫 Animated Stat Counter with Unit
 */
export function AnimatedStat({ number, unit, label, delay = 0 }) {
 const ref = useRef(null);
 const isInView = useInView(ref, { once: true });
 const [count, setCount] = useState(0);

 useEffect(() => {
 if (!isInView) return;

 let start = 0;
 const end = number;
 const duration = 2;
 const increment = end / (duration * 60);

 const timer = setInterval(() => {
 start += increment;
 if (start >= end) {
 setCount(end);
 clearInterval(timer);
 } else {
 setCount(Math.floor(start));
 }
 }, 1000 / 60);

 return () => clearInterval(timer);
 }, [isInView, number]);

 return (
 <motion.div
 ref={ref}
 className="text-center"
 initial={{ opacity: 0, scale: 0.8 }}
 animate={isInView ? { opacity: 1, scale: 1 } : {}}
 transition={{ duration: 0.6, delay }}
 >
 <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
 {count.toLocaleString()}{unit}
 </div>
 <p className="text-gray-400">{label}</p>
 </motion.div>
 );
}

/**
 * 🎬 Section Reveal with Stagger
 */
export function RevealSection({ children, className = '' }) {
 const ref = useRef(null);
 const isInView = useInView(ref, { once: true, margin: '-100px' });

 return (
 <motion.section
 ref={ref}
 className={className}
 initial={{ opacity: 0 }}
 animate={isInView ? { opacity: 1 } : {}}
 transition={{ duration: 0.6 }}
 >
 {children}
 </motion.section>
 );
}

/**
 * 🌟 Spotlight Effect Background
 */
export function SpotlightBackground({ children, className = '' }) {
 const containerRef = useRef(null);
 const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

 const handleMouseMove = (e) => {
 const rect = containerRef.current?.getBoundingClientRect();
 if (rect) {
 setMousePosition({
 x: e.clientX - rect.left,
 y: e.clientY - rect.top,
 });
 }
 };

 return (
 <div
 ref={containerRef}
 className={`relative w-full overflow-hidden ${className}`}
 onMouseMove={handleMouseMove}
 >
 {/* Spotlight */}
 <motion.div
 className="absolute pointer-events-none"
 style={{
 width: 500,
 height: 500,
 left: mousePosition.x - 250,
 top: mousePosition.y - 250,
 background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
 filter: 'blur(40px)',
 }}
 />

 {/* Content */}
 <div className="relative z-10">
 {children}
 </div>
 </div>
 );
}

/**
 * 🔮 Glassmorphism Button with Gradient Border
 */
export function GlassmorphButton({ children, onClick, className = '' }) {
 return (
 <motion.button
 onClick={onClick}
 className={`relative px-8 py-3 rounded-lg font-semibold text-white overflow-hidden group ${className}`}
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 transition={{ type: 'spring', stiffness: 400, damping: 25 }}
 >
 {/* Gradient Border */}
 <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg" />

 {/* Glass Background */}
 <div className="absolute inset-[2px] bg-gradient-to-br from-blue-600/80 to-green-600/80 backdrop-blur-xl rounded-lg" />

 {/* Hover Shine Effect */}
 <motion.div
 className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity"
 style={{
 background: 'linear-gradient(45deg, transparent, white, transparent)',
 transform: 'translateX(-100%)',
 }}
 animate={{
 x: ['0%', '100%'],
 }}
 transition={{
 duration: 0.6,
 repeat: Infinity,
 }}
 />

 {/* Content */}
 <span className="relative z-10 flex items-center justify-center gap-2">
 {children}
 </span>
 </motion.button>
 );
}

/**
 * 🎨 Gradient Text Animation
 */
export function AnimatedGradientText({ text, className = '' }) {
 return (
 <motion.h1
 className={`text-4xl md:text-6xl font-bold ${className}`}
 style={{
 backgroundImage: 'linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #3b82f6)',
 backgroundSize: '300% 100%',
 WebkitBackgroundClip: 'text',
 WebkitTextFillColor: 'transparent',
 backgroundClip: 'text',
 }}
 animate={{
 backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
 }}
 transition={{
 duration: 8,
 repeat: Infinity,
 ease: 'linear',
 }}
 >
 {text}
 </motion.h1>
 );
}

/**
 * ⚡ Pulse Ring Animation
 */
export function PulseRing({ children, className = '' }) {
 return (
 <motion.div
 className={`relative inline-block ${className}`}
 >
 <motion.div
 className="absolute inset-0 rounded-full border-2 border-blue-500"
 animate={{
 scale: [1, 1.5],
 opacity: [1, 0],
 }}
 transition={{
 duration: 2,
 repeat: Infinity,
 ease: 'easeOut',
 }}
 />

 <motion.div
 className="absolute inset-0 rounded-full border-2 border-green-500"
 animate={{
 scale: [1, 1.3],
 opacity: [1, 0],
 }}
 transition={{
 duration: 2,
 delay: 0.5,
 repeat: Infinity,
 ease: 'easeOut',
 }}
 />

 <div className="relative z-10">
 {children}
 </div>
 </motion.div>
 );
}

export default {
 HeroSection,
 GlowingCard,
 AnimatedFeatureCard,
 AnimatedStat,
 RevealSection,
 SpotlightBackground,
 GlassmorphButton,
 AnimatedGradientText,
 PulseRing,
};
