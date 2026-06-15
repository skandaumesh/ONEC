'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Pill, Stethoscope, Search, ChevronDown } from 'lucide-react';

const quickSuggestions = [
 { text: 'Common cold remedies', icon: '🤧' },
 { text: 'Headache relief', icon: '🤕' },
 { text: 'Vitamin supplements', icon: '💊' },
 { text: 'Diabetes management', icon: '🩸' },
 { text: 'Skin care tips', icon: '✨' },
 { text: 'Drug interactions', icon: '⚠️' },
];

const aiResponses = {
 'common cold': `For common cold symptoms, I recommend:\n\n💊 **Dolo 650mg** — For fever and body ache\n💊 **Cetirizine 10mg** — For runny nose and sneezing\n💊 **Vicks VapoRub** — For nasal congestion\n💊 **Strepsils** — For sore throat\n\n🏠 **Home remedies:** Drink warm water with honey and ginger, get adequate rest, and stay hydrated.\n\n⚠️ Consult a doctor if symptoms persist beyond 7 days.`,
 'headache': `For headache relief:\n\n💊 **Dolo 650mg (Paracetamol)** — Safe and effective, take 1 tablet every 6-8 hours\n💊 **Crocin Advance** — Fast-acting pain relief\n💊 **Saridon** — For tension headaches\n\n🏠 **Quick tips:**\n• Stay hydrated\n• Apply cold compress on forehead\n• Rest in a dark, quiet room\n• Gentle neck stretches\n\n⚠️ If headaches are frequent or severe, please consult a neurologist.`,
 'vitamin': `Here are essential vitamin supplements:\n\n💊 **Centrum Multivitamin** — Complete daily nutrition\n💊 **Vitamin D3 (Cholecalciferol)** — For bone health and immunity\n💊 **Vitamin B12** — For energy and nerve function\n💊 **Omega-3 Fish Oil** — Heart and brain health\n💊 **Vitamin C** — Immunity booster\n\n📋 **Recommendation:** Take supplements after meals for better absorption. Get a blood test to check deficiency levels.`,
 'diabetes': `For diabetes management:\n\n📋 **Essential monitoring:**\n• Check blood sugar regularly\n• HbA1c test every 3 months\n• Annual eye and kidney check\n\n💊 **Common medicines:**\n• Metformin — First-line treatment\n• Glimepiride — Stimulates insulin\n• Insulin (if required)\n\n🥗 **Lifestyle tips:**\n• Low GI diet\n• 30 min daily walk\n• Avoid sugary drinks\n• Regular sleep schedule\n\n⚠️ Always follow your doctor's prescription for diabetes medications.`,
 'skin care': `Skin care recommendations:\n\n💊 **Products:**\n• Neutrogena SPF 50 — Daily sun protection\n• Cetaphil Gentle Cleanser — For sensitive skin\n• Bioderma Sensibio — Micellar water\n• Himalaya Neem Face Wash — For oily/acne skin\n\n✨ **Daily routine:**\n1. Cleanse → 2. Tone → 3. Moisturize → 4. Sunscreen\n\n🌙 **Night routine:**\n1. Double cleanse → 2. Serum → 3. Night cream\n\n💡 Drink 8 glasses of water daily for glowing skin!`,
 'drug interaction': `⚠️ **Drug Interaction Checker**\n\nSome common dangerous interactions:\n\n🔴 **Aspirin + Warfarin** — Increased bleeding risk\n🔴 **Metformin + Alcohol** — Risk of lactic acidosis\n🟡 **Paracetamol + Alcohol** — Liver damage risk\n🟡 **Antacids + Antibiotics** — Reduced antibiotic absorption\n\n📋 **Tips:**\n• Always inform your doctor about all medications\n• Don't mix medicines without consultation\n• Read medicine labels carefully\n• Use our prescription upload to check interactions\n\n⚠️ For specific interaction queries, please consult your pharmacist.`,
 'default': `I'm your ONEC Pharma AI Health Assistant! 🤖\n\nI can help you with:\n• 💊 Medicine recommendations\n• 🩺 Symptom guidance\n• ⚠️ Drug interaction info\n• 🥗 Health & wellness tips\n• 📋 Prescription guidance\n\nPlease note: I provide general health information only. For specific medical advice, always consult a qualified healthcare professional.\n\nWhat would you like to know?`,
};

function getAIResponse(message) {
 const lower = message.toLowerCase();
 if (lower.includes('cold') || lower.includes('cough') || lower.includes('flu') || lower.includes('sneez')) return aiResponses['common cold'];
 if (lower.includes('headache') || lower.includes('head') || lower.includes('pain') || lower.includes('migraine')) return aiResponses['headache'];
 if (lower.includes('vitamin') || lower.includes('supplement') || lower.includes('nutrition')) return aiResponses['vitamin'];
 if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('insulin') || lower.includes('glucose')) return aiResponses['diabetes'];
 if (lower.includes('skin') || lower.includes('acne') || lower.includes('face') || lower.includes('glow')) return aiResponses['skin care'];
 if (lower.includes('interaction') || lower.includes('drug') || lower.includes('mix') || lower.includes('combine')) return aiResponses['drug interaction'];
 if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return `Hello! 👋 Welcome to ONEC Pharma AI Health Assistant.\n\nHow can I help you today? You can ask about medicines, symptoms, health tips, or drug interactions.`;
 if (lower.includes('thank')) return `You're welcome! 😊 Stay healthy! If you need anything else, feel free to ask.\n\n💊 Don't forget to check out our products for the best prices on genuine medicines.`;
 return aiResponses['default'];
}

export default function AIChatbot() {
 const [isOpen, setIsOpen] = useState(false);
 const [messages, setMessages] = useState([
 { id: 1, type: 'bot', text: `Hi there! 👋 I'm your AI Health Assistant.\n\nHow can I help you today? Try asking about medicines, symptoms, or health tips!`, time: new Date() },
 ]);
 const [input, setInput] = useState('');
 const [typing, setTyping] = useState(false);
 const messagesEndRef = useRef(null);
 const inputRef = useRef(null);

 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages, typing]);

 const handleSend = async (text = input) => {
 const msg = text.trim();
 if (!msg) return;

 // Add user message
 setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: msg, time: new Date() }]);
 setInput('');
 setTyping(true);

 // Simulate AI thinking
 await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

 // Add bot response
 const response = getAIResponse(msg);
 setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: response, time: new Date() }]);
 setTyping(false);
 };

 const handleQuickAction = (text) => {
 handleSend(text);
 };

 return (
 <>
 {/* Chat Bubble */}
 <AnimatePresence>
 {!isOpen && (
 <motion.button
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 exit={{ scale: 0 }}
 whileHover={{ scale: 1.1 }}
 whileTap={{ scale: 0.9 }}
 onClick={() => setIsOpen(true)}
 className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary text-white shadow-xl flex items-center justify-center"
 style={{ boxShadow: '0 4px 20px rgba(5,150,105,0.4)' }}
 >
 <MessageCircle size={24} />
 {/* Pulse ring */}
 <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" style={{ animationDuration: '3s' }} />
 </motion.button>
 )}
 </AnimatePresence>

 {/* Chat Window */}
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, y: 20, scale: 0.9 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 20, scale: 0.9 }}
 transition={{ type: 'spring', stiffness: 400, damping: 30 }}
 className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
 style={{
 height: '560px',
 maxHeight: 'calc(100vh - 100px)',
 background: 'var(--bg-primary)',
 border: '1px solid var(--border-color)',
 }}
 >
 {/* Header */}
 <div className="gradient-primary p-4 text-white flex items-center justify-between flex-shrink-0">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
 <Sparkles size={20} />
 </div>
 <div>
 <h3 className="font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>AI Health Assistant</h3>
 <p className="text-xs text-white/70 flex items-center gap-1">
 <span className="w-2 h-2 rounded-full bg-green-300 inline-block" />
 Online • ONEC Pharma
 </p>
 </div>
 </div>
 <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
 <X size={18} />
 </button>
 </div>

 {/* Messages */}
 <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: 'var(--bg-primary)' }}>
 {messages.map((msg) => (
 <motion.div
 key={msg.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
 >
 <div
 className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
 msg.type === 'user'
 ? 'gradient-primary text-white rounded-br-md'
 : 'rounded-bl-md'
 }`}
 style={msg.type === 'bot' ? {
 background: 'var(--bg-surface)',
 border: '1px solid var(--border-color)',
 color: 'var(--text-primary)',
 } : {}}
 >
 <div style={{ whiteSpace: 'pre-line' }}
 dangerouslySetInnerHTML={{
 __html: msg.text
 .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
 .replace(/\n/g, '<br/>')
 }}
 />
 <p className={`text-[10px] mt-1.5 ${msg.type === 'user' ? 'text-white/60' : ''}`}
 style={msg.type === 'bot' ? { color: 'var(--text-muted)' } : {}}>
 {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </p>
 </div>
 </motion.div>
 ))}

 {/* Typing indicator */}
 {typing && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
 <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
 <div className="flex gap-1.5">
 {[0, 1, 2].map(i => (
 <motion.span
 key={i}
 className="w-2 h-2 rounded-full bg-primary"
 animate={{ y: [0, -6, 0] }}
 transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
 />
 ))}
 </div>
 </div>
 </motion.div>
 )}

 {/* Quick suggestions — show only if <= 2 messages */}
 {messages.length <= 2 && !typing && (
 <div className="flex flex-wrap gap-2 pt-2">
 {quickSuggestions.map((suggestion, i) => (
 <motion.button
 key={i}
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 onClick={() => handleQuickAction(suggestion.text)}
 className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:bg-primary/10 hover:text-primary"
 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
 >
 {suggestion.icon} {suggestion.text}
 </motion.button>
 ))}
 </div>
 )}

 <div ref={messagesEndRef} />
 </div>

 {/* Input */}
 <div className="p-3 border-t flex-shrink-0" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
 <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
 <input
 ref={inputRef}
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder="Ask about medicines, symptoms..."
 className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
 style={{
 background: 'var(--bg-surface-hover)',
 border: '1px solid var(--border-color)',
 color: 'var(--text-primary)',
 }}
 disabled={typing}
 />
 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 type="submit"
 disabled={!input.trim() || typing}
 className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
 >
 <Send size={16} />
 </motion.button>
 </form>
 <p className="text-[10px] text-center mt-2" style={{ color: 'var(--text-muted)' }}>
 AI assistant for general health info only • Not medical advice
 </p>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </>
 );
}
