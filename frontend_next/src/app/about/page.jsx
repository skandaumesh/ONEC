"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
 Heart, Shield, Users, Truck, Award, Clock, Target, Zap,
 TrendingUp, MapPin, Phone, ArrowRight
} from 'lucide-react';
import { PageTransition, SlideUp, FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

const values = [
 { icon: <Shield size={28} />, title: '100% Genuine', desc: 'All medicines are sourced directly from licensed manufacturers and verified for authenticity.' },
 { icon: <Heart size={28} />, title: 'Patient First', desc: 'Our pharmacists review every order to ensure safety and correct dosage for our customers.' },
 { icon: <Zap size={28} />, title: 'AI-Powered', desc: 'Cutting-edge AI for prescription scanning, drug interactions, and personalized health recommendations.' },
 { icon: <Truck size={28} />, title: 'Fast Delivery', desc: 'Get your medicines delivered within 24 hours. Free delivery on orders above ₹499.' },
 { icon: <Award size={28} />, title: 'Certified', desc: 'Licensed pharmacy compliant with all Indian pharmaceutical regulations and standards.' },
 { icon: <Users size={28} />, title: 'Expert Support', desc: '24/7 customer support with qualified pharmacists available for consultations.' },
];

const stats = [
 { value: '10L+', label: 'Happy Customers' },
 { value: '50K+', label: 'Products Available' },
 { value: '500+', label: 'Cities Served' },
 { value: '99.9%', label: 'Uptime Reliability' },
];

const timeline = [
 { year: '2023', title: 'Founded', desc: 'ONEC Pharma was founded with a vision to make healthcare accessible to everyone.' },
 { year: '2024', title: 'AI Integration', desc: 'Launched AI-powered prescription scanning and drug interaction checker.' },
 { year: '2025', title: '1 Million Users', desc: 'Crossed 1 million registered users with 500+ city coverage.' },
 { year: '2026', title: 'Expanding Horizons', desc: 'Launched health subscription plans and same-day delivery in metro cities.' },
];

export default function AboutPage() {
 return (
 <PageTransition>
 {/* Hero */}
 <section className="bg-mesh-gradient py-20 px-4 text-white relative overflow-hidden border-b border-slate-200/50 ">
 <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
 <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
 <div className="max-w-4xl mx-auto text-center relative z-10">
 <SlideUp>
 <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF6F61]/10 text-[#FF6F61] text-[10px] font-black uppercase tracking-wider mb-6 border border-[#FF6F61]/20">
 About ONEC Pharma
 </span>
 <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight text-[#102A43] ">
 Making Healthcare Accessible <br />Through <span className="gradient-text">Technology</span>
 </h1>
 <p className="text-xs md:text-sm font-bold text-slate-500 max-w-2xl mx-auto leading-relaxed">
 We're on a mission to deliver genuine medicines at the best prices, powered by
 AI and backed by licensed pharmacists, to every doorstep in India.
 </p>
 </SlideUp>
 </div>
 </section>

 {/* Stats */}
 <section className="py-12 px-4 -mt-12 relative z-20">
 <div className="max-w-4xl mx-auto">
 <div className="rounded-3xl p-6 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 glass-blur border border-slate-200/50 ">
 {stats.map((stat, i) => (
 <FadeIn key={i} delay={i * 0.1}>
 <div className="text-center">
 <p className="text-2xl md:text-3xl font-black text-[#FF6F61]" style={{ fontFamily: 'var(--font-heading)' }}>{stat.value}</p>
 <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-slate-400">{stat.label}</p>
 </div>
 </FadeIn>
 ))}
 </div>
 </div>
 </section>

 {/* Mission */}
 <section className="py-16 px-4 relative z-10">
 <div className="max-w-4xl mx-auto">
 <SlideUp>
 <div className="text-center mb-12">
 <h2 className="text-2xl md:text-3xl font-black mb-3 text-[#102A43] ">
 Our Mission & Values
 </h2>
 <p className="text-xs font-bold text-slate-400 ">
 Every decision we make is guided by our commitment to patient safety and healthcare innovation
 </p>
 </div>
 </SlideUp>

 <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
 {values.map((v, i) => (
 <StaggerItem key={i}>
 <div className="rounded-3xl p-6 h-full shadow-md hover:shadow-xl hover:border-[#FF6F61]/30 hover:-translate-y-1 transition-all duration-300 group glass-blur border border-slate-200/50 ">
 <div className="w-14 h-14 rounded-2xl bg-[#FF6F61]/10 flex items-center justify-center text-[#FF6F61] mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
 {v.icon}
 </div>
 <h3 className="text-base font-black mb-2 text-[#102A43] ">{v.title}</h3>
 <p className="text-xs font-bold leading-relaxed text-slate-500 ">{v.desc}</p>
 </div>
 </StaggerItem>
 ))}
 </StaggerContainer>
 </div>
 </section>

 {/* Timeline */}
 <section className="py-20 px-4 bg-white/40 relative z-10 border-y border-slate-200/50 ">
 <div className="max-w-3xl mx-auto">
 <SlideUp>
 <h2 className="text-2xl md:text-3xl font-black text-center mb-12 text-[#102A43] ">
 Our Journey
 </h2>
 </SlideUp>
 <div className="relative">
 <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#FF6F61]/20" />
 {timeline.map((item, i) => (
 <FadeIn key={i} delay={i * 0.15}>
 <div className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
 <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-[#FF6F61] -translate-x-1/2 mt-1.5 z-10 ring-4 ring-white #08111B]" />
 <div className={`ml-14 md:ml-0 md:w-[calc(50%-32px)] ${i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
 <span className="text-xs font-black text-[#FF6F61] uppercase tracking-wider">{item.year}</span>
 <h3 className="text-base font-black mt-1 text-[#102A43] ">{item.title}</h3>
 <p className="text-xs font-bold mt-1 text-slate-500 leading-relaxed">{item.desc}</p>
 </div>
 </div>
 </FadeIn>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-20 px-4 bg-mesh-gradient text-center relative z-10 border-b border-slate-200/50 ">
 <div className="max-w-3xl mx-auto">
 <FadeIn>
 <h2 className="text-3xl font-black mb-3 text-[#102A43] ">
 Ready to Experience Better Healthcare?
 </h2>
 <p className="text-xs font-bold text-slate-500 mb-8 max-w-sm mx-auto">Join millions of satisfied customers who trust ONEC Pharma</p>
 <div className="flex flex-wrap justify-center gap-4">
 <Link href="/products" className="px-6 py-3.5 bg-[#FF6F61] text-white rounded-2xl font-black text-xs hover:bg-[#E05A4D] transition-all shadow-md hover:shadow-lg flex items-center gap-2 btn-shine">
 Shop Now <ArrowRight size={16} />
 </Link>
 <Link href="/contact" className="px-6 py-3.5 bg-white/80 #141D2F]/80 backdrop-blur border border-slate-200/50 text-[#102A43] rounded-2xl font-black text-xs hover:border-[#FF6F61] transition-all flex items-center justify-center">
 Contact Us
 </Link>
 </div>
 </FadeIn>
 </div>
 </section>
 </PageTransition>
 );
}
