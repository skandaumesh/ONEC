import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
 Upload, FileImage, X, Check, Loader2, ShoppingCart, Sparkles,
 ClipboardList, Shield, Clock, ArrowRight, AlertTriangle, File
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { PageTransition, SlideUp, FadeIn, StaggerContainer, StaggerItem } from '../components/animations';

const demoDetectedMeds = [
 { id: 1, name: 'Dolo 650mg Tablet', manufacturer: 'Micro Labs', quantity: '15 tablets', price: 25.50, confidence: 98 },
 { id: 9, name: 'Centrum Multivitamin', manufacturer: 'Pfizer', quantity: '30 tablets', price: 382.50, confidence: 95 },
 { id: 4, name: 'Himalaya Liv.52 DS', manufacturer: 'Himalaya', quantity: '60 tablets', price: 195.50, confidence: 92 },
];

const howItWorks = [
 { step: 1, title: 'Upload Prescription', desc: 'Take a photo or upload your prescription image/PDF', icon: <Upload size={24} /> },
 { step: 2, title: 'AI Processes It', desc: 'Our AI extracts medicine details from your prescription', icon: <Sparkles size={24} /> },
 { step: 3, title: 'Review & Order', desc: 'Verify detected medicines and add them to your cart', icon: <ShoppingCart size={24} /> },
];

export default function PrescriptionUploadPage() {
 const navigate = useNavigate();
 const { isAuthenticated } = useAuth();
 const { addItem } = useCart();
 const { success, error: showError, info } = useToast();
 const fileInputRef = useRef(null);

 const [file, setFile] = useState(null);
 const [preview, setPreview] = useState(null);
 const [uploading, setUploading] = useState(false);
 const [progress, setProgress] = useState(0);
 const [processing, setProcessing] = useState(false);
 const [detectedMeds, setDetectedMeds] = useState([]);
 const [selectedMeds, setSelectedMeds] = useState(new Set());
 const [dragOver, setDragOver] = useState(false);

 const handleFileSelect = (selectedFile) => {
 if (!selectedFile) return;
 const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
 if (!validTypes.includes(selectedFile.type)) {
 showError('Please upload a JPG, PNG, or PDF file');
 return;
 }
 if (selectedFile.size > 10 * 1024 * 1024) {
 showError('File size must be under 10MB');
 return;
 }
 setFile(selectedFile);
 if (selectedFile.type.startsWith('image/')) {
 const reader = new FileReader();
 reader.onload = (e) => setPreview(e.target.result);
 reader.readAsDataURL(selectedFile);
 } else {
 setPreview(null);
 }
 setDetectedMeds([]);
 setSelectedMeds(new Set());
 };

 const handleDrop = (e) => {
 e.preventDefault();
 setDragOver(false);
 const droppedFile = e.dataTransfer.files[0];
 handleFileSelect(droppedFile);
 };

 const handleUpload = async () => {
 if (!file) { showError('Please select a file first'); return; }
 if (!isAuthenticated) { navigate('/login'); return; }

 setUploading(true);
 setProgress(0);

 // Simulate upload progress
 const progressInterval = setInterval(() => {
 setProgress(prev => {
 if (prev >= 100) { clearInterval(progressInterval); return 100; }
 return prev + Math.random() * 15;
 });
 }, 200);

 // Simulate upload delay
 await new Promise(resolve => setTimeout(resolve, 2000));
 clearInterval(progressInterval);
 setProgress(100);
 setUploading(false);

 // Simulate AI processing
 setProcessing(true);
 info('🤖 AI is analyzing your prescription...');
 await new Promise(resolve => setTimeout(resolve, 3000));
 setProcessing(false);

 // Show results
 setDetectedMeds(demoDetectedMeds);
 setSelectedMeds(new Set(demoDetectedMeds.map(m => m.id)));
 success(`✅ Found ${demoDetectedMeds.length} medicines in your prescription!`);
 };

 const toggleMed = (id) => {
 setSelectedMeds(prev => {
 const newSet = new Set(prev);
 if (newSet.has(id)) newSet.delete(id);
 else newSet.add(id);
 return newSet;
 });
 };

 const handleAddAllToCart = async () => {
 const medsToAdd = detectedMeds.filter(m => selectedMeds.has(m.id));
 for (const med of medsToAdd) {
 await addItem(med.id);
 }
 success(`${medsToAdd.length} medicines added to cart! 🛒`);
 };

 const clearUpload = () => {
 setFile(null);
 setPreview(null);
 setDetectedMeds([]);
 setSelectedMeds(new Set());
 setProgress(0);
 if (fileInputRef.current) fileInputRef.current.value = '';
 };

 return (
 <PageTransition>
 <div className="max-w-5xl mx-auto px-4 py-8">
 <SlideUp>
 <div className="text-center mb-10">
 <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
 <Sparkles size={16} /> AI-Powered
 </span>
 <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 Upload Your Prescription
 </h1>
 <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
 Our AI will scan your prescription, detect medicines, and help you order them instantly
 </p>
 </div>
 </SlideUp>

 <div className="grid md:grid-cols-5 gap-8">
 {/* Upload Area */}
 <div className="md:col-span-3">
 <FadeIn delay={0.1}>
 {/* Drop Zone */}
 <motion.div
 whileHover={{ scale: 1.01 }}
 animate={dragOver ? { scale: 1.03 } : { scale: 1 }}
 onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
 onDragLeave={() => setDragOver(false)}
 onDrop={handleDrop}
 onClick={() => !file && fileInputRef.current?.click()}
 className={`relative rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
 dragOver ? 'ring-4 ring-primary/30 bg-primary/5' : ''
 } ${file ? '' : 'hover:bg-primary/5 hover:shadow-lg'}`}
 style={{
 background: file ? 'var(--bg-surface)' : 'var(--bg-surface)',
 border: `2px dashed ${dragOver ? 'var(--color-primary)' : 'var(--border-color)'}`,
 minHeight: '280px',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 }}
 >
 <input
 ref={fileInputRef}
 type="file"
 accept=".jpg,.jpeg,.png,.pdf"
 onChange={(e) => handleFileSelect(e.target.files[0])}
 className="hidden"
 />

 {file ? (
 <div className="w-full relative">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 {file.type === 'application/pdf' ? (
 <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center relative overflow-hidden">
 <File size={24} className="text-red-600" />
 {processing && (
 <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] animate-laser-scan pointer-events-none" />
 )}
 </div>
 ) : (
 <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
 <FileImage size={24} className="text-blue-600" />
 </div>
 )}
 <div className="text-left">
 <p className="text-sm font-semibold truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
 <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</p>
 </div>
 </div>
 <button onClick={(e) => { e.stopPropagation(); clearUpload(); }} className="p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 cursor-pointer">
 <X size={18} />
 </button>
 </div>

 {preview && (
 <div className="relative overflow-hidden rounded-xl border max-w-md mx-auto" style={{ borderColor: 'var(--border-color)' }}>
 <img src={preview} alt="Prescription preview" className="w-full max-h-[300px] object-contain rounded-xl" />
 {processing && (
 <>
 {/* Sweeping Laser Line */}
 <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-laser-scan pointer-events-none" />
 {/* Green Scanning Shade */}
 <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
 </>
 )}
 </div>
 )}

 {/* Progress Bar */}
 {uploading && (
 <div className="mt-4">
 <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
 <span>Uploading...</span>
 <span>{Math.min(100, Math.round(progress))}%</span>
 </div>
 <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface-hover)' }}>
 <motion.div className="h-full gradient-primary rounded-full" style={{ width: `${Math.min(100, progress)}%` }} />
 </div>
 </div>
 )}

 {/* Processing */}
 {processing && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center justify-center gap-3 py-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
 <Loader2 size={20} className="animate-spin text-primary" />
 <span className="text-sm font-semibold text-emerald-700 ">AI is scanning your prescription...</span>
 </motion.div>
 )}
 </div>
 ) : (
 <>
 <motion.div
 animate={{ y: [0, -5, 0] }}
 transition={{ duration: 2, repeat: Infinity }}
 >
 <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse-ripple">
 <Upload size={28} className="text-primary" />
 </div>
 </motion.div>
 <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 Drop your prescription here
 </h3>
 <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
 or click to browse files
 </p>
 <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
 Supports: JPG, PNG, PDF (max 10MB)
 </p>
 </>
 )}
 </motion.div>

 {/* Upload Button */}
 {file && !detectedMeds.length && (
 <motion.button
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 onClick={handleUpload}
 disabled={uploading || processing}
 className="w-full mt-4 py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
 >
 {uploading ? (
 <><Loader2 size={18} className="animate-spin" /> Uploading...</>
 ) : processing ? (
 <><Loader2 size={18} className="animate-spin" /> Processing...</>
 ) : (
 <><Sparkles size={18} /> Analyze Prescription</>
 )}
 </motion.button>
 )}

 {/* Detected Medicines */}
 <AnimatePresence>
 {detectedMeds.length > 0 && (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="mt-6 rounded-2xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
 >
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-base font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 <Check size={18} className="text-green-500" /> Detected Medicines
 </h3>
 <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
 {detectedMeds.length} found
 </span>
 </div>

 <div className="space-y-2">
 {detectedMeds.map((med, i) => (
 <motion.label
 key={med.id}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: i * 0.1 }}
 className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
 selectedMeds.has(med.id) ? 'bg-primary/5 ring-1 ring-primary/20' : ''
 }`}
 style={{ border: '1px solid var(--border-color)' }}
 >
 <input
 type="checkbox"
 checked={selectedMeds.has(med.id)}
 onChange={() => toggleMed(med.id)}
 className="accent-emerald-600 w-4 h-4"
 />
 <div className="flex-1">
 <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{med.name}</p>
 <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{med.manufacturer} • {med.quantity}</p>
 </div>
 <div className="text-right">
 <p className="text-sm font-bold text-primary">₹{med.price}</p>
 <p className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">{med.confidence}% match</p>
 </div>
 </motion.label>
 ))}
 </div>

 <button
 onClick={handleAddAllToCart}
 disabled={selectedMeds.size === 0}
 className="w-full mt-4 py-3 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
 >
 <ShoppingCart size={16} /> Add {selectedMeds.size} Medicine{selectedMeds.size !== 1 ? 's' : ''} to Cart
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </FadeIn>
 </div>

 {/* Sidebar */}
 <div className="md:col-span-2 space-y-6">
 {/* How it Works */}
 <FadeIn delay={0.2}>
 <div className="rounded-2xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
 <ClipboardList size={16} className="text-primary" /> How it Works
 </h3>
 <div className="space-y-4">
 {howItWorks.map((item, i) => (
 <div key={i} className="flex gap-3">
 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
 {item.icon}
 </div>
 <div>
 <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
 Step {item.step}: {item.title}
 </p>
 <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </FadeIn>

 {/* Trust */}
 <FadeIn delay={0.3}>
 <div className="rounded-2xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 <div className="space-y-3">
 {[
 { icon: <Shield size={16} />, text: 'Your prescription data is encrypted and secure' },
 { icon: <Clock size={16} />, text: 'AI processes prescriptions in under 30 seconds' },
 { icon: <AlertTriangle size={16} />, text: 'All medicines verified by licensed pharmacists' },
 ].map((item, i) => (
 <div key={i} className="flex items-start gap-2.5">
 <span className="text-primary mt-0.5">{item.icon}</span>
 <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
 </div>
 ))}
 </div>
 </div>
 </FadeIn>
 </div>
 </div>
 </div>
 </PageTransition>
 );
}
