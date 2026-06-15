"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle2, ChevronUp, ChevronDown
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { PageTransition, SlideUp, FadeIn, StaggerContainer, StaggerItem, TiltCard, ParticleField } from '@/components/animations';

const contactInfo = [
 { icon: <Phone size={22} />, title: 'Phone', details: ['+91 1800-XXX-XXXX (Toll Free)', 'Mon-Sat, 8AM - 10PM'], color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' },
 { icon: <Mail size={22} />, title: 'Email', details: ['support@onecpharma.com', 'Response within 24 hours'], color: 'bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' },
 { icon: <MapPin size={22} />, title: 'Office', details: ['ONEC Pharma HQ', 'Hyderabad, Telangana 500001'], color: 'bg-violet-500/10 text-violet-500 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' },
 { icon: <Clock size={22} />, title: 'Hours', details: ['Mon-Sat: 8:00 AM - 10:00 PM', 'Sun: 9:00 AM - 6:00 PM'], color: 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' },
];

const faqs = [
 { q: 'How do I upload my prescription?', a: 'You can upload your prescription by clicking the "Upload Prescription" button on our homepage or going to the Prescription Upload page. We accept JPG, PNG, and PDF formats. Our AI will automatically extract medicine details.' },
 { q: 'Is it safe to buy medicines online?', a: 'Absolutely! ONEC Pharma is a licensed online pharmacy. All medicines are sourced directly from authorized distributors and manufacturers. Every order is verified by our team of licensed pharmacists.' },
 { q: 'What is your return/refund policy?', a: 'We offer easy returns within 7 days of delivery for eligible products. Medicines cannot be returned once opened for safety reasons. Refunds are processed within 5-7 business days.' },
 { q: 'How fast is delivery?', a: 'We offer same-day delivery in metro cities for orders placed before 2 PM. Standard delivery takes 1-3 business days. Free delivery on all orders above ₹499.' },
 { q: 'Do you check for drug interactions?', a: 'Yes! Our AI-powered system automatically checks for potential drug interactions when you add medicines to your cart. Our pharmacists also review prescription orders before dispatching.' },
 { q: 'How does the AI Health Assistant work?', a: 'Our AI Health Assistant uses advanced natural language processing to understand your health queries and provide helpful information about medicines, symptoms, and wellness tips. It\'s available 24/7 in the chat widget.' },
];

export default function ContactPage() {
 const { success, error: showError } = useToast();
 const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
 const [sending, setSending] = useState(false);
 const [sent, setSent] = useState(false);
 const [openFaq, setOpenFaq] = useState(null);

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!form.name || !form.email || !form.message) {
 showError('Please fill all required fields');
 return;
 }
 setSending(true);
 await new Promise(resolve => setTimeout(resolve, 1500));
 setSending(false);
 setSent(true);
 success('Message sent successfully! We\'ll get back to you soon.');
 setForm({ name: '', email: '', subject: '', message: '' });
 setTimeout(() => setSent(false), 3000);
 };

 return (
 <PageTransition className="min-h-screen relative overflow-hidden bg-mesh-gradient">
 {/* Decorative Blobs */}
 <div className="float-blob-1 pointer-events-none" />
 <div className="float-blob-2 pointer-events-none" />

 {/* Hero Banner */}
 <section className="relative overflow-hidden border-b border-[var(--border-color)]" style={{ paddingTop: '160px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
 <ParticleField count={25} className="absolute inset-0 opacity-40" />
 <div className="max-w-3xl mx-auto text-center relative z-10">
 <SlideUp>
 <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
 Let's Start a <span className="gradient-text">Conversation</span>
 </h1>
 <p className="text-base text-[var(--text-secondary)] font-medium max-w-xl mx-auto">
 Have questions about medications, ordering, or our services? Our dedicated clinical team is here to support you 24/7.
 </p>
 </SlideUp>
 </div>
 </section>

 {/* Contact Cards */}
 <section className="relative z-20" style={{ paddingTop: '40px', paddingBottom: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
 <div className="max-w-6xl mx-auto">
 <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {contactInfo.map((info, i) => (
 <StaggerItem key={i}>
 <TiltCard maxTilt={6} className="h-full">
 <div className="rounded-3xl p-6 text-center shadow-lg hover:shadow-2xl transition-all h-full bg-[var(--bg-surface)] border border-[var(--border-color)] group hover:border-[var(--color-primary)]">
 <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 duration-300`}>
 {info.icon}
 </div>
 <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
 {info.title}
 </h3>
 {info.details.map((d, j) => (
 <p key={j} className="text-xs text-[var(--text-secondary)] leading-relaxed">{d}</p>
 ))}
 </div>
 </TiltCard>
 </StaggerItem>
 ))}
 </StaggerContainer>
 </div>
 </section>

 {/* Form + FAQ Grid */}
 <section className="py-12 px-4">
 <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
 {/* Glassmorphic Contact Form */}
 <FadeIn delay={0.1}>
 <div className="glass-card p-8 md:p-10 relative overflow-hidden shadow-2xl hover-border-gradient" style={{ border: '1px solid var(--border-color)' }}>
 {/* Glass Reflection Accent */}
 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

 <h2 className="text-2xl font-bold mb-2 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
 Send us a Message
 </h2>
 <p className="text-sm text-[var(--text-secondary)] mb-8 font-medium">Fill out the form below and we'll reply within 24 hours.</p>

 {sent ? (
 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16">
 <CheckCircle2 size={56} className="text-emerald-500 mx-auto mb-4 animate-bounce" />
 <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Message Dispatched!</h3>
 <p className="text-sm text-[var(--text-secondary)]">Your inquiry has been successfully sent. We'll be in touch shortly.</p>
 </motion.div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="floating-group">
 <div className="relative">
 <input
 value={form.name}
 onChange={e => setForm({...form, name: e.target.value})}
 required
 placeholder=" "
 className="w-full rounded-2xl text-xs font-semibold outline-none transition-all input-glass form-input-field"
 />
 <label className="floating-label font-semibold">Name *</label>
 </div>
 </div>
 <div className="floating-group">
 <div className="relative">
 <input
 type="email"
 value={form.email}
 onChange={e => setForm({...form, email: e.target.value})}
 required
 placeholder=" "
 className="w-full rounded-2xl text-xs font-semibold outline-none transition-all input-glass form-input-field"
 />
 <label className="floating-label font-semibold">Email address *</label>
 </div>
 </div>
 </div>

 <div className="floating-group">
 <div className="relative">
 <input
 value={form.subject}
 onChange={e => setForm({...form, subject: e.target.value})}
 placeholder=" "
 className="w-full rounded-2xl text-xs font-semibold outline-none transition-all input-glass form-input-field"
 />
 <label className="floating-label font-semibold">Subject</label>
 </div>
 </div>

 <div className="floating-group">
 <div className="relative">
 <textarea
 value={form.message}
 onChange={e => setForm({...form, message: e.target.value})}
 required
 placeholder=" "
 rows={4}
 className="w-full rounded-2xl text-xs font-semibold outline-none transition-all input-glass form-input-field resize-none"
 style={{ minHeight: '120px', paddingTop: '1.25rem' }}
 />
 <label className="floating-label font-semibold" style={{ top: '1.25rem', transform: 'none' }}>Your Message *</label>
 </div>
 </div>

 <button
 type="submit"
 disabled={sending}
 className="btn-premium btn-shine w-full py-4 flex items-center justify-center gap-2 text-white font-bold text-sm tracking-wide disabled:opacity-50"
 >
 {sending ? (
 <Loader2 size={18} className="animate-spin" />
 ) : (
 <>
 <Send size={16} /> Send Message
 </>
 )}
 </button>
 </form>
 )}
 </div>
 </FadeIn>

 {/* FAQ Accordion */}
 <FadeIn delay={0.2}>
 <div>
 <h2 className="text-2xl font-bold mb-2 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
 Frequently Asked Questions
 </h2>
 <p className="text-sm text-[var(--text-secondary)] mb-8 font-medium">Get immediate answers to common concerns.</p>

 <div className="space-y-4">
 {faqs.map((faq, i) => {
 const isOpen = openFaq === i;
 return (
 <div
 key={i}
 className="rounded-2xl overflow-hidden transition-all duration-300 border bg-[var(--bg-surface)]"
 style={{
 borderColor: isOpen ? 'var(--color-primary-light)' : 'var(--border-color)',
 boxShadow: isOpen ? '0 10px 25px rgba(255, 111, 97, 0.05)' : 'none'
 }}
 >
 <button
 onClick={() => setOpenFaq(isOpen ? null : i)}
 className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-[var(--bg-surface-hover)]"
 >
 <span className="text-sm font-semibold pr-4 text-[var(--text-primary)]">{faq.q}</span>
 <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-[var(--color-primary-lighter)] text-[var(--color-primary)]' : 'bg-transparent text-[var(--text-muted)]'}`}>
 {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
 </div>
 </button>
 <AnimatePresence initial={false}>
 {isOpen && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.25, ease: 'easeInOut' }}
 className="overflow-hidden bg-[var(--bg-surface-secondary)]"
 >
 <p className="px-5 pb-5 pt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
 {faq.a}
 </p>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
 })}
 </div>
 </div>
 </FadeIn>
 </div>
 </section>
 </PageTransition>
 );
}
