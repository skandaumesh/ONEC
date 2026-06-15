'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2 } from 'lucide-react';

export function AIPopup({ isOpen, onClose, productId, productName }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (isOpen && productId) {
      setInsight('');
      setDisplayedText('');
      setError(false);
      fetchInsight();
    }
  }, [isOpen, productId]);

  useEffect(() => {
    if (!insight) return;
    
    // Typewriter effect
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      setDisplayedText(prev => prev + insight.charAt(i));
      i++;
      if (i >= insight.length - 1) clearInterval(timer);
    }, 15);

    return () => clearInterval(timer);
  }, [insight]);

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (data.success) {
        setInsight(data.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderText = (text) => {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/\n/g, '<br/>');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg z-[101] bg-white rounded-3xl shadow-2xl border border-purple-500/20 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-700">
                <Sparkles size={20} className={loading ? 'animate-pulse' : ''} />
                <h3 className="font-bold text-sm tracking-wide">Ask AI: {productName}</h3>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-purple-100 text-purple-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[150px] max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-purple-500 gap-3 py-8">
                  <Loader2 size={32} className="animate-spin" />
                  <p className="text-sm font-medium animate-pulse">Generating Health Insights via Groq LLaMA...</p>
                </div>
              ) : error ? (
                <div className="text-red-500 text-sm text-center py-8">
                  Failed to generate AI insights. Please try again.
                </div>
              ) : (
                <div className="text-slate-700 leading-relaxed text-sm">
                  {renderText(displayedText)}
                  {displayedText.length < insight.length && (
                    <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse" />
                  )}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium">
                ⚡ Powered by Groq LLaMA 3. Not a substitute for professional medical advice.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
