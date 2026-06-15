'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 MessageCircle, X, Send, Plus, Copy, ThumbsUp, ThumbsDown,
 Sparkles, Loader, Volume2, VolumeX
} from 'lucide-react';
import clsx from 'clsx';

const AIChatbotPro = () => {
 const [isOpen, setIsOpen] = useState(false);
 const [messages, setMessages] = useState([
 {
 id: 1,
 type: 'bot',
 text: 'Hello! 👋 I\'m your AI Pharmacist Assistant. How can I help you today? I can assist with:\n• Medicine information\n• Health queries\n• Prescription guidance\n• Side effects information',
 timestamp: new Date()
 }
 ]);
 const [input, setInput] = useState('');
 const [loading, setLoading] = useState(false);
 const [isMuted, setIsMuted] = useState(false);
 const messagesEndRef = useRef(null);

 const scrollToBottom = () => {
 messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 };

 useEffect(() => {
 scrollToBottom();
 }, [messages]);

 const handleSendMessage = async (e) => {
 e.preventDefault();
 if (!input.trim()) return;

 // Add user message
 const userMessage = {
 id: Date.now(),
 type: 'user',
 text: input,
 timestamp: new Date()
 };
 setMessages((prev) => [...prev, userMessage]);
 setInput('');
 setLoading(true);

 // Simulate AI response (in production, call your API)
 setTimeout(() => {
 const botMessage = {
 id: Date.now() + 1,
 type: 'bot',
 text: generateResponse(input),
 timestamp: new Date()
 };
 setMessages((prev) => [...prev, botMessage]);
 setLoading(false);

 // Play notification sound if not muted
 if (!isMuted) {
 playNotificationSound();
 }
 }, 1000);
 };

 const generateResponse = (userInput) => {
 const responses = {
 'paracetamol': 'Paracetamol (Acetaminophen) is a common pain reliever and fever reducer. Typical dosage is 500-1000mg every 4-6 hours, max 4000mg daily. It\'s generally safe but avoid with alcohol. Always consult a pharmacist for your specific needs.',
 'aspirin': 'Aspirin is used for pain relief, fever reduction, and blood thinning. Standard dose is 300-600mg for pain. It may cause stomach upset, so take with food. Not suitable for children under 16 years without medical advice.',
 'vitamins': 'Vitamins are essential for body functions. Common types include:\n• Vitamin C: Immune support (1000mg daily)\n• Vitamin D: Bone health (2000 IU daily)\n• B-Complex: Energy metabolism\nMultivitamins are convenient but balanced diet is ideal.',
 'default': 'That\'s a great question! For specific medical advice about your symptoms or medications, I recommend consulting with a healthcare professional. However, I can provide general information about common medicines and their uses. What would you like to know?'
 };

 const input_lower = userInput.toLowerCase();
 for (const [keyword, response] of Object.entries(responses)) {
 if (keyword !== 'default' && input_lower.includes(keyword)) {
 return response;
 }
 }
 return responses.default;
 };

 const playNotificationSound = () => {
 // Create a simple beep sound
 const audioContext = new (window.AudioContext || window.webkitAudioContext)();
 const oscillator = audioContext.createOscillator();
 const gainNode = audioContext.createGain();

 oscillator.connect(gainNode);
 gainNode.connect(audioContext.destination);

 oscillator.frequency.value = 800;
 oscillator.type = 'sine';

 gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
 gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

 oscillator.start(audioContext.currentTime);
 oscillator.stop(audioContext.currentTime + 0.3);
 };

 const copyToClipboard = (text) => {
 navigator.clipboard.writeText(text);
 // You could show a toast notification here
 };

 const handleQuickQuestion = (question) => {
 setInput(question);
 // Auto submit
 setTimeout(() => {
 handleSendMessage({ preventDefault: () => {} });
 }, 0);
 };

 return (
 <>
 {/* Chatbot Button */}
 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => setIsOpen(!isOpen)}
 className={clsx(
 'fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-40 transition-all',
 isOpen ? 'gradient-primary' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
 )}
 title="AI Pharmacist Assistant"
 >
 <motion.div
 animate={{ rotate: isOpen ? 360 : 0 }}
 transition={{ duration: 0.3 }}
 >
 {isOpen ? (
 <X size={24} className="text-white" />
 ) : (
 <MessageCircle size={24} className="text-white" />
 )}
 </motion.div>
 {!isOpen && (
 <motion.div
 animate={{ scale: [1, 1.2, 1] }}
 transition={{ duration: 2, repeat: Infinity }}
 className="absolute w-4 h-4 bg-[var(--color-danger)] rounded-full -top-1 -right-1"
 />
 )}
 </motion.button>

 {/* Chatbot Window */}
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, scale: 0.8, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.8, y: 20 }}
 className="fixed bottom-24 right-6 w-96 h-[600px] rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-[var(--bg-surface)] border border-[var(--border-color)] z-40"
 style={{ maxWidth: 'calc(100vw - 2rem)' }}
 >
 {/* Header */}
 <div className="gradient-primary text-white p-4 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
 <Sparkles size={20} />
 </div>
 <div>
 <h3 className="font-semibold">AI Pharmacist</h3>
 <p className="text-xs opacity-90">Always available</p>
 </div>
 </div>
 <button
 onClick={() => setIsMuted(!isMuted)}
 className="p-2 hover:bg-white/20 rounded-lg transition-colors"
 >
 {isMuted ? (
 <VolumeX size={18} />
 ) : (
 <Volume2 size={18} />
 )}
 </button>
 </div>

 {/* Messages Container */}
 <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
 <AnimatePresence mode="popLayout">
 {messages.map((message, index) => (
 <motion.div
 key={message.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 className={clsx(
 'flex gap-3',
 message.type === 'user' ? 'justify-end' : 'justify-start'
 )}
 >
 {message.type === 'bot' && (
 <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
 <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
 </div>
 )}

 <div
 className={clsx(
 'max-w-xs px-4 py-3 rounded-lg text-sm break-words',
 message.type === 'user'
 ? 'bg-[var(--color-primary)] text-white'
 : 'bg-[var(--bg-surface-hover)] text-[var(--text-primary)]'
 )}
 >
 <p className="whitespace-pre-wrap">{message.text}</p>

 {message.type === 'bot' && (
 <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--border-color)]">
 <button
 onClick={() => copyToClipboard(message.text)}
 className="p-1 hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
 title="Copy"
 >
 <Copy size={14} />
 </button>
 <button
 className="p-1 hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
 title="Helpful"
 >
 <ThumbsUp size={14} />
 </button>
 <button
 className="p-1 hover:bg-[var(--bg-surface-hover)] rounded transition-colors"
 title="Not helpful"
 >
 <ThumbsDown size={14} />
 </button>
 </div>
 )}
 </div>
 </motion.div>
 ))}
 </AnimatePresence>

 {loading && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex gap-3 justify-start"
 >
 <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
 <Loader size={16} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
 </div>
 <div className="bg-[var(--bg-surface-hover)] px-4 py-3 rounded-lg">
 <div className="flex gap-1">
 <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" />
 <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce delay-100" />
 <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce delay-200" />
 </div>
 </div>
 </motion.div>
 )}

 <div ref={messagesEndRef} />
 </div>

 {/* Quick Questions */}
 {messages.length <= 1 && (
 <div className="px-4 py-3 border-t border-[var(--border-color)] space-y-2">
 <p className="text-xs font-semibold text-[var(--text-muted)]">Quick questions:</p>
 <div className="space-y-1">
 {[
 'What is Paracetamol?',
 'Vitamin information',
 'Common side effects'
 ].map((question) => (
 <button
 key={question}
 onClick={() => handleQuickQuestion(question)}
 className="w-full text-left text-xs px-3 py-2 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors text-[var(--text-secondary)]"
 >
 {question}
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Input Area */}
 <form
 onSubmit={handleSendMessage}
 className="border-t border-[var(--border-color)] p-4 flex gap-2"
 >
 <input
 type="text"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder="Ask about medicines, health..."
 className="flex-1 px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
 />
 <button
 type="submit"
 disabled={!input.trim() || loading}
 className={clsx(
 'p-2.5 rounded-lg transition-all',
 input.trim() && !loading
 ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
 : 'bg-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed'
 )}
 >
 <Send size={18} />
 </button>
 </form>
 </motion.div>
 )}
 </AnimatePresence>
 </>
 );
};

export default AIChatbotPro;
