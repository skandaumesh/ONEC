import Link from 'next/link';
import { Phone, Mail, MapPin, Globe, MessageCircle, Camera, Play } from 'lucide-react';

export default function Footer() {
 const currentYear = new Date().getFullYear();

 return (
 <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
 <div className="max-w-7xl mx-auto px-4 py-12">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
 {/* Brand */}
 <div>
 <div className="flex items-center gap-2 mb-4">
 <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
 <span className="text-white font-bold text-lg">O</span>
 </div>
 <div>
 <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>ONEC</span>
 <span className="text-xl font-light" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)' }}> Pharma</span>
 </div>
 </div>
 <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
 Your trusted AI-powered pharmacy delivering genuine medicines at the best prices. Licensed & verified pharmacy with 24/7 support.
 </p>
 <div className="flex gap-3">
 {[Globe, MessageCircle, Camera, Play].map((Icon, i) => (
 <a key={i} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-primary/10 hover:text-primary"
 style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-muted)' }}>
 <Icon size={16} />
 </a>
 ))}
 </div>
 </div>

 {/* Quick Links */}
 <div>
 <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Quick Links</h4>
 <ul className="space-y-2.5">
 {[
 { name: 'All Medicines', path: '/products' },
 { name: 'Upload Prescription', path: '/prescription-upload' },
 { name: 'Health Blog', path: '/blog' },
 { name: 'Track Order', path: '/orders' },
 { name: 'Offers & Deals', path: '/products' },
 ].map(link => (
 <li key={link.name}>
 <Link href={link.path} className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--text-secondary)' }}>
 {link.name}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 {/* Categories */}
 <div>
 <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Top Categories</h4>
 <ul className="space-y-2.5">
 {['Medicines', 'Vitamins & Supplements', 'Diabetes Care', 'Skin Care', 'Ayurveda'].map(cat => (
 <li key={cat}>
 <Link href="/products" className="text-sm transition-colors hover:text-primary" style={{ color: 'var(--text-secondary)' }}>
 {cat}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 {/* Contact */}
 <div>
 <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Contact Us</h4>
 <ul className="space-y-3">
 <li className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
 <Phone size={16} className="text-primary shrink-0" />
 +91 1800-xxx-xxxx
 </li>
 <li className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
 <Mail size={16} className="text-primary shrink-0" />
 support@onecpharma.com
 </li>
 <li className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
 <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
 ONEC Pharma HQ, Hyderabad, Telangana 500001, India
 </li>
 </ul>
 </div>
 </div>

 {/* Trust Badges */}
 <div className="flex flex-wrap justify-center gap-6 my-8 py-6 rounded-xl" style={{ background: 'var(--bg-surface-hover)' }}>
 {[
 { icon: '💊', label: '100% Genuine Medicines' },
 { icon: '🔒', label: 'Secure Payments' },
 { icon: '🚚', label: 'Fast Delivery' },
 { icon: '📋', label: 'Licensed Pharmacy' },
 ].map(badge => (
 <div key={badge.label} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
 <span className="text-lg">{badge.icon}</span>
 {badge.label}
 </div>
 ))}
 </div>

 {/* Bottom */}
 <div className="flex flex-col md:flex-row justify-between items-center pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
 <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
 © {currentYear} ONEC Pharma. All rights reserved.
 </p>
 <div className="flex gap-4 mt-2 md:mt-0">
 {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(link => (
 <a key={link} href="#" className="text-xs hover:text-primary transition-colors" style={{ color: 'var(--text-muted)' }}>
 {link}
 </a>
 ))}
 </div>
 </div>
 </div>
 </footer>
 );
}
