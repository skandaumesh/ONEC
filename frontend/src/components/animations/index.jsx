import { motion, useInView, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';

// ---- Basic Animations ----

export function FadeIn({ children, delay = 0, duration = 0.5, className = '' }) {
 return (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration, delay, ease: 'easeOut' }}
 className={className}
 >
 {children}
 </motion.div>
 );
}

export function SlideUp({ children, delay = 0, duration = 0.5, className = '' }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration, delay, ease: 'easeOut' }}
 className={className}
 >
 {children}
 </motion.div>
 );
}

export function SlideIn({ children, direction = 'left', delay = 0, duration = 0.5, className = '' }) {
 const x = direction === 'left' ? -30 : direction === 'right' ? 30 : 0;
 const y = direction === 'up' ? 30 : direction === 'down' ? -30 : 0;
 return (
 <motion.div
 initial={{ opacity: 0, x, y }}
 animate={{ opacity: 1, x: 0, y: 0 }}
 transition={{ duration, delay, ease: 'easeOut' }}
 className={className}
 >
 {children}
 </motion.div>
 );
}

export function ScaleIn({ children, delay = 0, duration = 0.3, className = '' }) {
 return (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration, delay, ease: 'easeOut' }}
 className={className}
 >
 {children}
 </motion.div>
 );
}

export function StaggerContainer({ children, staggerDelay = 0.05, className = '' }) {
 return (
 <motion.div
 initial="hidden"
 animate="visible"
 variants={{
 visible: {
 transition: {
 staggerChildren: staggerDelay,
 },
 },
 }}
 className={className}
 >
 {children}
 </motion.div>
 );
}

export function StaggerItem({ children, className = '' }) {
 return (
 <motion.div
 variants={{
 hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
 }}
 className={className}
 >
 {children}
 </motion.div>
 );
}

export function ScaleOnHover({ children, scale = 1.02, className = '' }) {
 return (
 <motion.div
 whileHover={{ scale }}
 whileTap={{ scale: 0.98 }}
 transition={{ type: 'spring', stiffness: 400, damping: 25 }}
 className={className}
 >
 {children}
 </motion.div>
 );
}

export function PageTransition({ children, className = '' }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.3, ease: 'easeInOut' }}
 className={className}
 >
 {children}
 </motion.div>
 );
}

export function AnimatedCounter({ value, duration = 1.5, className = '' }) {
 return (
 <motion.span
 className={className}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 0.3 }}
 >
 <motion.span
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 key={value}
 >
 {value?.toLocaleString?.() || value}
 </motion.span>
 </motion.span>
 );
}

// ---- Advanced Animations ----

/**
 * Parallax wrapper — children move at a different rate relative to scroll
 */
export function ParallaxWrapper({ children, speed = 0.3, className = '' }) {
 const ref = useRef(null);
 const [offsetY, setOffsetY] = useState(0);

 useEffect(() => {
 const handleScroll = () => {
 if (!ref.current) return;
 const rect = ref.current.getBoundingClientRect();
 const center = rect.top + rect.height / 2;
 const viewCenter = window.innerHeight / 2;
 setOffsetY((center - viewCenter) * speed);
 };
 window.addEventListener('scroll', handleScroll, { passive: true });
 handleScroll();
 return () => window.removeEventListener('scroll', handleScroll);
 }, [speed]);

 return (
 <div ref={ref} className={className}>
 <motion.div style={{ y: offsetY }}>
 {children}
 </motion.div>
 </div>
 );
}

/**
 * Magnetic hover — element subtly follows cursor within its bounds
 */
export function MagneticHover({ children, strength = 0.3, className = '' }) {
 const ref = useRef(null);

 const handleMouseMove = useCallback((e) => {
 if (!ref.current) return;
 const rect = ref.current.getBoundingClientRect();
 const x = (e.clientX - rect.left - rect.width / 2) * strength;
 const y = (e.clientY - rect.top - rect.height / 2) * strength;
 ref.current.style.setProperty('--mag-x', `${x}px`);
 ref.current.style.setProperty('--mag-y', `${y}px`);
 }, [strength]);

 const handleMouseLeave = useCallback(() => {
 if (!ref.current) return;
 ref.current.style.setProperty('--mag-x', '0px');
 ref.current.style.setProperty('--mag-y', '0px');
 }, []);

 return (
 <div
 ref={ref}
 className={`magnetic-hover ${className}`}
 onMouseMove={handleMouseMove}
 onMouseLeave={handleMouseLeave}
 >
 {children}
 </div>
 );
}

/**
 * Text reveal — words animate in one by one when in viewport
 */
export function TextReveal({ text, className = '', as: Tag = 'span', stagger = 0.04 }) {
 const ref = useRef(null);
 const isInView = useInView(ref, { once: true, margin: '-50px' });
 const words = text.split(' ');

 return (
 <Tag ref={ref} className={className} style={{ display: 'inline' }}>
 {words.map((word, i) => (
 <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.3em' }}>
 <motion.span
 style={{ display: 'inline-block' }}
 initial={{ y: '100%', opacity: 0 }}
 animate={isInView ? { y: 0, opacity: 1 } : {}}
 transition={{
 duration: 0.5,
 delay: i * stagger,
 ease: [0.16, 1, 0.3, 1],
 }}
 >
 {word}
 </motion.span>
 </span>
 ))}
 </Tag>
 );
}

/**
 * Typewriter text — characters appear one by one
 */
export function TypewriterText({ text, speed = 50, className = '', onComplete }) {
 const [displayText, setDisplayText] = useState('');
 const [showCursor, setShowCursor] = useState(true);

 useEffect(() => {
 let i = 0;
 setDisplayText('');
 const timer = setInterval(() => {
 if (i < text.length) {
 setDisplayText(text.slice(0, i + 1));
 i++;
 } else {
 clearInterval(timer);
 onComplete?.();
 setTimeout(() => setShowCursor(false), 2000);
 }
 }, speed);
 return () => clearInterval(timer);
 }, [text, speed]);

 return (
 <span className={className}>
 {displayText}
 {showCursor && <span className="typewriter-cursor" />}
 </span>
 );
}

/**
 * Animated number — counts up with spring physics when in viewport
 */
export function AnimatedNumber({ value, duration = 2, className = '', prefix = '', suffix = '' }) {
 const ref = useRef(null);
 const isInView = useInView(ref, { once: true });
 const motionValue = useMotionValue(0);
 const springValue = useSpring(motionValue, { stiffness: 50, damping: 20, duration: duration * 1000 });
 const [display, setDisplay] = useState('0');

 useEffect(() => {
 if (isInView) {
 motionValue.set(typeof value === 'number' ? value : parseFloat(value) || 0);
 }
 }, [isInView, value, motionValue]);

 useEffect(() => {
 const unsubscribe = springValue.on('change', (v) => {
 setDisplay(Math.round(v).toLocaleString());
 });
 return unsubscribe;
 }, [springValue]);

 return (
 <span ref={ref} className={className}>
 {prefix}{display}{suffix}
 </span>
 );
}

/**
 * Floating element — organic float animation with configurable amplitude
 */
export function FloatingElement({ children, amplitude = 15, duration = 6, delay = 0, className = '' }) {
 return (
 <motion.div
 animate={{
 y: [0, -amplitude, 0, amplitude * 0.5, 0],
 rotate: [0, 1.5, 0, -1, 0],
 }}
 transition={{
 duration,
 repeat: Infinity,
 ease: 'easeInOut',
 delay,
 }}
 className={className}
 >
 {children}
 </motion.div>
 );
}

/**
 * Wave divider — SVG wave between sections
 */
export function WaveDivider({ flip = false, className = '', variant = 'primary' }) {
 return (
 <div className={`wave-divider ${variant === 'surface' ? 'wave-divider-surface' : ''} ${className}`}
 style={flip ? { transform: 'rotate(180deg)' } : {}}>
 <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
 <path d="M0,0 C360,60 720,0 1080,40 C1260,55 1380,20 1440,0 L1440,60 L0,60 Z" />
 </svg>
 </div>
 );
}

/**
 * Particle field — lightweight canvas with floating particles
 */
export function ParticleField({ count = 30, color = 'rgba(13, 71, 161, 0.15)', className = '' }) {
 const canvasRef = useRef(null);
 const animationRef = useRef(null);
 const particlesRef = useRef([]);

 useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');

 const resize = () => {
 canvas.width = canvas.offsetWidth * window.devicePixelRatio;
 canvas.height = canvas.offsetHeight * window.devicePixelRatio;
 ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
 };
 resize();

 // Initialize particles
 particlesRef.current = Array.from({ length: count }, () => ({
 x: Math.random() * canvas.offsetWidth,
 y: Math.random() * canvas.offsetHeight,
 r: Math.random() * 3 + 1,
 vx: (Math.random() - 0.5) * 0.4,
 vy: (Math.random() - 0.5) * 0.4,
 opacity: Math.random() * 0.5 + 0.2,
 }));

 const animate = () => {
 ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
 const particles = particlesRef.current;
 const w = canvas.offsetWidth;
 const h = canvas.offsetHeight;

 particles.forEach((p) => {
 p.x += p.vx;
 p.y += p.vy;
 if (p.x < 0) p.x = w;
 if (p.x > w) p.x = 0;
 if (p.y < 0) p.y = h;
 if (p.y > h) p.y = 0;

 ctx.beginPath();
 ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
 ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.opacity})`);
 ctx.fill();
 });

 // Draw connecting lines between nearby particles
 for (let i = 0; i < particles.length; i++) {
 for (let j = i + 1; j < particles.length; j++) {
 const dx = particles[i].x - particles[j].x;
 const dy = particles[i].y - particles[j].y;
 const dist = Math.sqrt(dx * dx + dy * dy);
 if (dist < 120) {
 ctx.beginPath();
 ctx.moveTo(particles[i].x, particles[i].y);
 ctx.lineTo(particles[j].x, particles[j].y);
 ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${0.08 * (1 - dist / 120)})`);
 ctx.lineWidth = 0.5;
 ctx.stroke();
 }
 }
 }

 animationRef.current = requestAnimationFrame(animate);
 };

 animate();
 window.addEventListener('resize', resize);

 return () => {
 cancelAnimationFrame(animationRef.current);
 window.removeEventListener('resize', resize);
 };
 }, [count, color]);

 return (
 <canvas
 ref={canvasRef}
 className={`particle-canvas ${className}`}
 style={{ width: '100%', height: '100%' }}
 />
 );
}

/**
 * Scroll progress bar — thin gradient bar at top of page
 */
export function ScrollProgress() {
 const [progress, setProgress] = useState(0);

 useEffect(() => {
 const handleScroll = () => {
 const total = document.documentElement.scrollHeight - window.innerHeight;
 setProgress(total > 0 ? window.scrollY / total : 0);
 };
 window.addEventListener('scroll', handleScroll, { passive: true });
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 return (
 <div
 className="scroll-progress"
 style={{ transform: `scaleX(${progress})`, opacity: progress > 0.01 ? 1 : 0 }}
 />
 );
}

/**
 * Cursor follower — custom dot that follows mouse on desktop
 */
export function CursorFollower() {
 const dotRef = useRef(null);

 useEffect(() => {
 // Only on desktop
 if (window.matchMedia('(pointer: coarse)').matches) return;

 const dot = dotRef.current;
 if (!dot) return;

 let mouseX = 0, mouseY = 0;
 let dotX = 0, dotY = 0;

 const handleMouseMove = (e) => {
 mouseX = e.clientX;
 mouseY = e.clientY;
 };

 const handleMouseOver = (e) => {
 const interactive = e.target.closest('a, button, input, select, textarea, [role="button"]');
 if (interactive) {
 dot.classList.add('hovering');
 } else {
 dot.classList.remove('hovering');
 }
 };

 const animate = () => {
 dotX += (mouseX - dotX) * 0.15;
 dotY += (mouseY - dotY) * 0.15;
 dot.style.left = `${dotX}px`;
 dot.style.top = `${dotY}px`;
 requestAnimationFrame(animate);
 };

 document.addEventListener('mousemove', handleMouseMove);
 document.addEventListener('mouseover', handleMouseOver);
 animate();

 return () => {
 document.removeEventListener('mousemove', handleMouseMove);
 document.removeEventListener('mouseover', handleMouseOver);
 };
 }, []);

 return <div ref={dotRef} className="cursor-dot" />;
}

/**
 * 3D Tilt Card — card tilts toward cursor position on hover
 */
export function TiltCard({ children, className = '', maxTilt = 8 }) {
 const ref = useRef(null);

 const handleMouseMove = useCallback((e) => {
 if (!ref.current) return;
 const rect = ref.current.getBoundingClientRect();
 const x = (e.clientX - rect.left) / rect.width;
 const y = (e.clientY - rect.top) / rect.height;
 const tiltX = (y - 0.5) * maxTilt * -1;
 const tiltY = (x - 0.5) * maxTilt;
 ref.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
 }, [maxTilt]);

 const handleMouseLeave = useCallback(() => {
 if (!ref.current) return;
 ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
 }, []);

 return (
 <div
 ref={ref}
 className={className}
 onMouseMove={handleMouseMove}
 onMouseLeave={handleMouseLeave}
 style={{
 transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
 transformStyle: 'preserve-3d',
 willChange: 'transform',
 }}
 >
 {children}
 </div>
 );
}

// Import and re-export Premium Animations
export {
 HeroSection,
 GlowingCard,
 AnimatedFeatureCard,
 AnimatedStat,
 RevealSection,
 SpotlightBackground,
 GlassmorphButton,
 AnimatedGradientText,
 PulseRing,
} from './PremiumAnimations';
