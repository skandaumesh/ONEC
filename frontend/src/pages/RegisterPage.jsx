import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Loader2, Pill, Shield, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
 const { register } = useAuth();
 const navigate = useNavigate();
 const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
 const [showPassword, setShowPassword] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 const passwordStrength = useMemo(() => {
 const p = form.password;
 if (!p) return { level: 0, label: '', cls: '' };
 let score = 0;
 if (p.length >= 6) score++;
 if (p.length >= 10) score++;
 if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
 if (/\d/.test(p)) score++;
 if (/[^A-Za-z0-9]/.test(p)) score++;
 if (score <= 2) return { level: 1, label: 'Weak', cls: 'strength-weak' };
 if (score <= 3) return { level: 2, label: 'Medium', cls: 'strength-medium' };
 return { level: 3, label: 'Strong', cls: 'strength-strong' };
 }, [form.password]);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
 if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
 setLoading(true);
 try {
 await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password });
 navigate('/');
 } catch (err) {
 setError(err.response?.data?.message || 'Registration failed. Please try again.');
 } finally {
 setLoading(false);
 }
 };

 const floatingIcons = [
 { icon: Pill, top: '12%', left: '15%', delay: 0, size: 30 },
 { icon: Heart, top: '60%', left: '80%', delay: 1, size: 24 },
 { icon: Sparkles, top: '80%', left: '20%', delay: 2.5, size: 22 },
 { icon: Shield, top: '25%', left: '72%', delay: 1.5, size: 26 },
 ];

 const formFields = [
 { row: true, fields: [
 { name: 'firstName', label: 'First Name', type: 'text', icon: User, placeholder: 'John', delay: 0.1 },
 { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', delay: 0.15 },
 ]},
 { name: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com', delay: 0.2 },
 { name: 'phone', label: 'Phone', type: 'tel', icon: Phone, placeholder: '+91 98xxx xxxxx', delay: 0.25 },
 { name: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: 'Min 6 characters', delay: 0.3, isPassword: true },
 { name: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: Lock, placeholder: 'Repeat password', delay: 0.35 },
 ];

 const renderInput = (field) => {
 const Icon = field.icon;
 const value = form[field.name];
 return (
 <div className="floating-group relative">
 {Icon && <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] z-10" />}
 <input
 type={field.isPassword ? (showPassword ? 'text' : 'password') : field.type}
 required
 value={value}
 onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
 placeholder=" "
 className="w-full pr-12 rounded-2xl text-xs font-semibold outline-none transition-all input-glass form-input-field"
 style={{ paddingLeft: Icon ? '2.6rem' : '1rem' }}
 />
 <label className="floating-label font-semibold" style={{ left: Icon ? '2.6rem' : '1rem' }}>
 {field.label}
 </label>
 {field.isPassword && (
 <button type="button" onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer z-10">
 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
 </button>
 )}
 </div>
 );
 };

 return (
 <div className="min-h-[90vh] flex items-stretch relative overflow-hidden bg-[var(--bg-primary)] #08111B]">
 {/* Left Visual Panel */}
 <div className="hidden lg:flex lg:w-[45%] bg-mesh-gradient items-center justify-center p-12 relative border-r border-slate-200/50 ">
 {floatingIcons.map(({ icon: Icon, top, left, delay, size }, idx) => (
 <motion.div
 key={idx}
 animate={{ y: [0, -16, 0], rotate: [0, 12, 0], scale: [1, 1.03, 1] }}
 transition={{ duration: 6 + idx, repeat: Infinity, delay, ease: "easeInOut" }}
 className="absolute opacity-20"
 style={{ top, left }}
 >
 <Icon size={size} className="text-[#FF6F61] #FFA49A]" />
 </motion.div>
 ))}
 <div className="relative z-10 text-center max-w-sm">
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
 className="w-20 h-20 rounded-3xl bg-white/25 #FF6F61]/15 backdrop-blur-lg flex items-center justify-center mx-auto mb-8 border border-white/20 #FF6F61]/20 shadow-2xl"
 >
 <Pill size={36} className="text-[#FF6F61] #FFA49A]" />
 </motion.div>
 <motion.h2
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="text-3xl font-black text-[#102A43] tracking-tight mb-4"
 >
 Join ONEC<br />
 <span className="gradient-text">Pharmacy</span>
 </motion.h2>
 <motion.p
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 className="text-slate-500 text-xs font-bold leading-relaxed mb-8"
 >
 Create your account and get access to exclusive health benefits, personalized offers, and fast delivery.
 </motion.p>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.6 }}
 className="flex justify-center gap-3"
 >
 {['Free Delivery', 'Exclusive Deals', '24/7 Support'].map((badge) => (
 <span key={badge} className="text-[9px] font-black text-[#FF6F61] #FFA49A] bg-[#FFF3F2] #FF6F61]/10 px-3.5 py-1.5 rounded-full border border-[#FF6F61]/10">
 {badge}
 </span>
 ))}
 </motion.div>
 </div>
 </div>

 {/* Right Form Panel */}
 <div className="flex-1 flex items-center justify-center px-6 py-12">
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.5 }}
 className="w-full max-w-md"
 >
 <div className="lg:hidden text-center mb-8">
 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mx-auto mb-4 shadow-lg">
 <Pill size={24} className="text-white" />
 </div>
 </div>

 <div className="rounded-[2.5rem] p-8 md:p-10 frosted-glass border border-slate-200/50 shadow-xl relative overflow-hidden">
 {/* Glow accent */}
 <div className="absolute -right-16 -top-16 w-32 h-32 bg-[#FF6F61]/5 rounded-full blur-xl pointer-events-none" />

 <div className="mb-7 relative z-10">
 <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)] mb-1">Create Account</h1>
 <p className="text-xs text-[var(--text-secondary)] font-bold">Join ONEC Pharma for exclusive health benefits</p>
 </div>

 {error && (
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold"
 >
 {error}
 </motion.div>
 )}

 <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
 {/* Name row */}
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="grid grid-cols-2 gap-3"
 >
 <div>
 {renderInput({ name: 'firstName', label: 'First Name', type: 'text', icon: User })}
 </div>
 <div>
 {renderInput({ name: 'lastName', label: 'Last Name', type: 'text' })}
 </div>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 >
 {renderInput({ name: 'email', label: 'Email', type: 'email', icon: Mail })}
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.25 }}
 >
 {renderInput({ name: 'phone', label: 'Phone', type: 'tel', icon: Phone })}
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 >
 {renderInput({ name: 'password', label: 'Password', type: 'password', icon: Lock, isPassword: true })}
 {/* Password Strength Bar */}
 {form.password && (
 <div className="mt-2.5">
 <div className="w-full h-1.5 rounded-full bg-[var(--border-color)]/60 overflow-hidden">
 <div className={`strength-bar h-full rounded-full transition-all duration-300 ${passwordStrength.cls}`} />
 </div>
 <p className={`text-[10px] font-black mt-1 ${passwordStrength.level === 1 ? 'text-red-500' : passwordStrength.level === 2 ? 'text-amber-500' : 'text-emerald-500'}`}>
 {passwordStrength.label}
 </p>
 </div>
 )}
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.35 }}
 >
 {renderInput({ name: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: Lock })}
 </motion.div>

 <motion.button
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 type="submit"
 disabled={loading}
 whileHover={{ scale: 1.01 }}
 whileTap={{ scale: 0.99 }}
 className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-black text-xs hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md btn-shine cursor-pointer"
 >
 {loading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
 </motion.button>
 </form>

 {/* Divider */}
 <div className="flex items-center gap-3 my-5 relative z-10">
 <div className="flex-1 h-px bg-[var(--border-color)]/60" />
 <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">or</span>
 <div className="flex-1 h-px bg-[var(--border-color)]/60" />
 </div>

 {/* Social Login */}
 <div className="grid grid-cols-2 gap-3 relative z-10">
 <motion.button 
 whileHover={{ scale: 1.03, borderColor: 'var(--color-primary)' }}
 whileTap={{ scale: 0.97 }}
 className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] #141D2F]/80 hover:bg-[var(--bg-surface-hover)] transition-all text-xs font-bold text-[var(--text-primary)] cursor-pointer"
 >
 <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
 Google
 </motion.button>
 <motion.button 
 whileHover={{ scale: 1.03, borderColor: 'var(--color-primary)' }}
 whileTap={{ scale: 0.97 }}
 className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] #141D2F]/80 hover:bg-[var(--bg-surface-hover)] transition-all text-xs font-bold text-[var(--text-primary)] cursor-pointer"
 >
 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
 Apple
 </motion.button>
 </div>

 <p className="text-center text-xs mt-5 text-[var(--text-secondary)] font-semibold relative z-10">
 Already have an account? <Link to="/login" className="font-black text-[var(--color-primary)] hover:underline">Login</Link>
 </p>
 </div>
 </motion.div>
 </div>
 </div>
 );
}
