"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Key, ArrowRight, Loader2, Pill, Shield, Sparkles } from 'lucide-react';
import { authApi } from '@/api';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
 const { success, error: showError } = useToast();
 const router = useRouter();
 const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
 const [form, setForm] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 const handleRequestOtp = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);
 try {
 await authApi.forgotPassword({ email: form.email });
 success('OTP sent successfully! Please check backend console/logs.');
 setStep(2);
 } catch (err) {
 setError(err.response?.data?.message || 'Failed to request OTP');
 showError(err.response?.data?.message || 'Failed to request OTP');
 } finally {
 setLoading(false);
 }
 };

 const handleVerifyOtp = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);
 try {
 await authApi.verifyOtp({ email: form.email, otp: form.otp });
 success('OTP verified successfully!');
 setStep(3);
 } catch (err) {
 setError(err.response?.data?.message || 'Invalid OTP code');
 showError(err.response?.data?.message || 'Invalid OTP code');
 } finally {
 setLoading(false);
 }
 };

 const handleResetPassword = async (e) => {
 e.preventDefault();
 setError('');
 if (form.newPassword !== form.confirmPassword) {
 setError('Passwords do not match');
 return;
 }
 if (form.newPassword.length < 6) {
 setError('Password must be at least 6 characters');
 return;
 }
 setLoading(true);
 try {
 await authApi.resetPassword({ email: form.email, otp: form.otp, newPassword: form.newPassword });
 success('Password reset successfully! Logging you in...');
 setTimeout(() => {
 router.push('/login');
 }, 1500);
 } catch (err) {
 setError(err.response?.data?.message || 'Failed to reset password');
 showError(err.response?.data?.message || 'Failed to reset password');
 } finally {
 setLoading(false);
 }
 };

 const floatingIcons = [
 { icon: Pill, top: '15%', left: '20%', delay: 0, size: 28 },
 { icon: Shield, top: '55%', left: '75%', delay: 1.5, size: 24 },
 { icon: Sparkles, top: '75%', left: '25%', delay: 3, size: 22 },
 ];

 return (
 <div className="min-h-[90vh] flex items-stretch relative overflow-hidden bg-[var(--bg-primary)]">
 {/* Left Visual Panel — Hidden on mobile */}
 <div className="hidden lg:flex lg:w-[45%] auth-split-left items-center justify-center p-12 relative">
 {floatingIcons.map(({ icon: Icon, top, left, delay, size }, idx) => (
 <motion.div
 key={idx}
 animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
 transition={{ duration: 5 + idx, repeat: Infinity, delay }}
 className="absolute opacity-20"
 style={{ top, left }}
 >
 <Icon size={size} className="text-white" />
 </motion.div>
 ))}

 <div className="relative z-10 text-center max-w-sm">
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
 className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-lg flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl"
 >
 <Key size={36} className="text-white" />
 </motion.div>

 <motion.h2
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="text-3xl font-black text-white tracking-tight mb-4"
 >
 Forgot<br />Your Password?
 </motion.h2>

 <motion.p
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 className="text-white/70 text-sm leading-relaxed mb-8"
 >
 No worries! Simply request a secure OTP code to quickly verify your identity and safely reset your password credentials.
 </motion.p>
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
 <div className="rounded-[2rem] p-8 md:p-10 glass-surface shadow-xl">
 {/* Header */}
 <div className="mb-8">
 <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)] mb-1">
 {step === 1 && 'Reset Password'}
 {step === 2 && 'Verify OTP Code'}
 {step === 3 && 'New Credentials'}
 </h1>
 <p className="text-sm text-[var(--text-secondary)]">
 {step === 1 && 'Enter your email to receive a verification OTP code'}
 {step === 2 && `Enter the 6-digit OTP code printed in your server logs`}
 {step === 3 && 'Choose a strong new password for your account'}
 </p>
 </div>

 {/* Error Message */}
 {error && (
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium"
 >
 {error}
 </motion.div>
 )}

 {/* Wizard Forms */}
 {step === 1 && (
 <form onSubmit={handleRequestOtp} className="space-y-5">
 <div className="relative focus-glow rounded-xl transition-all">
 <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
 <input
 type="email"
 required
 value={form.email}
 onChange={(e) => setForm({ ...form, email: e.target.value })}
 placeholder="you@example.com"
 className="w-full pr-4 py-3 rounded-xl text-sm outline-none transition-all"
 style={{ paddingLeft: '2.6rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
 />
 </div>
 <button
 type="submit"
 disabled={loading}
 className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md cursor-pointer"
 >
 {loading ? <Loader2 size={18} className="animate-spin" /> : <>Send OTP Code <ArrowRight size={16} /></>}
 </button>
 </form>
 )}

 {step === 2 && (
 <form onSubmit={handleVerifyOtp} className="space-y-5">
 <div className="relative focus-glow rounded-xl transition-all">
 <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
 <input
 type="text"
 required
 maxLength={6}
 value={form.otp}
 onChange={(e) => setForm({ ...form, otp: e.target.value })}
 placeholder="Enter 6-digit OTP"
 className="w-full pr-4 py-3 rounded-xl text-sm outline-none tracking-widest text-center font-bold transition-all"
 style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
 />
 </div>
 <button
 type="submit"
 disabled={loading}
 className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md cursor-pointer"
 >
 {loading ? <Loader2 size={18} className="animate-spin" /> : <>Verify OTP Code <ArrowRight size={16} /></>}
 </button>
 <button
 type="button"
 onClick={() => setStep(1)}
 className="w-full text-center text-xs font-bold text-[var(--color-primary)] hover:underline block cursor-pointer"
 >
 Back to Email
 </button>
 </form>
 )}

 {step === 3 && (
 <form onSubmit={handleResetPassword} className="space-y-5">
 <div>
 <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-[var(--text-muted)]">New Password</label>
 <div className="relative focus-glow rounded-xl transition-all">
 <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
 <input
 type="password"
 required
 value={form.newPassword}
 onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
 placeholder="••••••••"
 className="w-full py-3 rounded-xl text-sm outline-none transition-all"
 style={{ paddingLeft: '2.6rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
 />
 </div>
 </div>

 <div>
 <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-[var(--text-muted)]">Confirm Password</label>
 <div className="relative focus-glow rounded-xl transition-all">
 <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
 <input
 type="password"
 required
 value={form.confirmPassword}
 onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
 placeholder="••••••••"
 className="w-full py-3 rounded-xl text-sm outline-none transition-all"
 style={{ paddingLeft: '2.6rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
 />
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md cursor-pointer"
 >
 {loading ? <Loader2 size={18} className="animate-spin" /> : <>Reset Password <ArrowRight size={16} /></>}
 </button>
 </form>
 )}

 <p className="text-center text-xs mt-6 text-[var(--text-secondary)]">
 Remember your password?{' '}
 <Link href="/login" className="font-bold text-[var(--color-primary)] hover:underline">Log in</Link>
 </p>
 </div>
 </motion.div>
 </div>
 </div>
 );
}
