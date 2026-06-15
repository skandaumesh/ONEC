import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, User, ArrowRight, Tag, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition, SlideUp, FadeIn, StaggerContainer, StaggerItem, ScaleOnHover } from '../components/animations';

const categories = ['All', 'Wellness', 'Nutrition', 'Mental Health', 'Fitness', 'Skincare', 'Diabetes'];

const blogPosts = [
 {
 id: 1, title: '10 Essential Vitamins Your Body Needs Daily',
 excerpt: 'Discover the key vitamins that keep your body functioning at its best, from Vitamin D for bone health to B12 for energy production.',
 category: 'Nutrition', author: 'Dr. Priya Sharma', date: '2026-05-20', readTime: '5 min',
 image: 'https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=600',
 featured: true,
 },
 {
 id: 2, title: 'Managing Diabetes: A Complete Guide to Blood Sugar Control',
 excerpt: 'Expert tips on monitoring blood sugar, dietary changes, exercise routines, and medication management for diabetic patients.',
 category: 'Diabetes', author: 'Dr. Rahul Verma', date: '2026-05-18', readTime: '8 min',
 image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
 featured: false,
 },
 {
 id: 3, title: 'The Science Behind Ayurvedic Medicine',
 excerpt: 'How traditional Ayurvedic remedies are backed by modern science. From turmeric to ashwagandha, explore their proven benefits.',
 category: 'Wellness', author: 'Dr. Anita Patel', date: '2026-05-15', readTime: '6 min',
 image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600',
 featured: false,
 },
 {
 id: 4, title: '5 Skincare Habits That Transform Your Skin',
 excerpt: 'Build the perfect skincare routine with these dermatologist-approved habits. From sunscreen to retinol, learn what actually works.',
 category: 'Skincare', author: 'Dr. Neha Gupta', date: '2026-05-12', readTime: '4 min',
 image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
 featured: false,
 },
 {
 id: 5, title: 'Stress Management: Techniques for a Calmer Mind',
 excerpt: 'Practical strategies to manage stress and anxiety in daily life. Includes breathing exercises, meditation tips, and lifestyle changes.',
 category: 'Mental Health', author: 'Dr. Vikas Kumar', date: '2026-05-10', readTime: '7 min',
 image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
 featured: false,
 },
 {
 id: 6, title: 'Home Workouts: Stay Fit Without a Gym',
 excerpt: 'Effective bodyweight exercises you can do at home. Perfect for beginners and busy professionals looking to maintain fitness.',
 category: 'Fitness', author: 'Coach Arjun', date: '2026-05-08', readTime: '5 min',
 image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
 featured: false,
 },
];

export default function BlogPage() {
 const [selectedCategory, setSelectedCategory] = useState('All');

 const filteredPosts = selectedCategory === 'All'
 ? blogPosts
 : blogPosts.filter(p => p.category === selectedCategory);

 const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];
 const regularPosts = filteredPosts.filter(p => p.id !== featuredPost.id);

 return (
 <PageTransition>
 <div className="max-w-6xl mx-auto px-4 py-8">
 {/* Header */}
 <SlideUp>
 <div className="text-center mb-10">
 <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
 <BookOpen size={16} /> Health Blog
 </span>
 <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 Health & Wellness Insights
 </h1>
 <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
 Expert articles on health, nutrition, fitness, and wellness from our team of doctors and pharmacists
 </p>
 </div>
 </SlideUp>

 {/* Category Filter */}
 <div className="flex gap-2 mb-8 overflow-x-auto pb-2 justify-center flex-wrap">
 {categories.map(cat => (
 <button
 key={cat}
 onClick={() => setSelectedCategory(cat)}
 className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
 selectedCategory === cat ? 'gradient-primary text-white shadow-md' : ''
 }`}
 style={selectedCategory !== cat ? { background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' } : {}}
 >
 {cat}
 </button>
 ))}
 </div>

 {/* Featured Post */}
 {selectedCategory === 'All' && (
 <FadeIn>
 <ScaleOnHover scale={1.01}>
 <div className="rounded-2xl overflow-hidden mb-10 group"
 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 <div className="grid md:grid-cols-2">
 <div className="aspect-video md:aspect-auto overflow-hidden">
 <img src={featuredPost.image} alt={featuredPost.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=600'; }} />
 </div>
 <div className="p-8 flex flex-col justify-center">
 <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-fit mb-4">
 ⭐ Featured • {featuredPost.category}
 </span>
 <h2 className="text-xl md:text-2xl font-bold mb-3 leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 {featuredPost.title}
 </h2>
 <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
 {featuredPost.excerpt}
 </p>
 <div className="flex items-center gap-4 mb-4">
 <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
 <User size={14} /> {featuredPost.author}
 </span>
 <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
 <Clock size={14} /> {featuredPost.readTime} read
 </span>
 </div>
 <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline w-fit">
 Read More <ArrowRight size={14} />
 </button>
 </div>
 </div>
 </div>
 </ScaleOnHover>
 </FadeIn>
 )}

 {/* Blog Grid */}
 <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {regularPosts.map(post => (
 <StaggerItem key={post.id}>
 <ScaleOnHover>
 <article className="rounded-2xl overflow-hidden group h-full flex flex-col"
 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 <div className="aspect-video overflow-hidden relative">
 <img src={post.image} alt={post.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=400'; }} />
 <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-emerald-700 backdrop-blur-sm">
 {post.category}
 </span>
 </div>
 <div className="p-5 flex-1 flex flex-col">
 <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
 <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
 <span>•</span>
 <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
 </div>
 <h3 className="text-base font-bold mb-2 leading-snug line-clamp-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 {post.title}
 </h3>
 <p className="text-sm leading-relaxed mb-4 line-clamp-2 flex-1" style={{ color: 'var(--text-secondary)' }}>
 {post.excerpt}
 </p>
 <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline mt-auto">
 Read Article <ChevronRight size={14} />
 </button>
 </div>
 </article>
 </ScaleOnHover>
 </StaggerItem>
 ))}
 </StaggerContainer>

 {filteredPosts.length === 0 && (
 <div className="text-center py-16">
 <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
 <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>No articles found</h3>
 <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No articles in this category yet. Check back soon!</p>
 </div>
 )}
 </div>
 </PageTransition>
 );
}
