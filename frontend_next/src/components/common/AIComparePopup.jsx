import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function AIComparePopup({ isOpen, onClose, products }) {
  const [insight, setInsight] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && products?.length === 2) {
      setInsight('');
      setDisplayedText('');
      setError(null);
      fetchComparison();
    }
  }, [isOpen, products]);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: products.map(p => p.id) })
      });
      const data = await res.json();
      if (data.success) {
        setInsight(data.data);
      } else {
        setError(data.message || 'Failed to generate comparison.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (insight) {
      let i = 0;
      setDisplayedText('');
      const interval = setInterval(() => {
        setDisplayedText(insight.substring(0, i));
        i++;
        if (i > insight.length) {
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [insight]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 flex items-center justify-between border-b border-purple-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                <Sparkles size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-800">
                AI Compare: <span className="text-purple-600">{products[0]?.name}</span> vs <span className="text-indigo-600">{products[1]?.name}</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 min-h-[250px] max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-purple-600">
                <Loader2 size={32} className="animate-spin" />
                <p className="font-semibold animate-pulse text-sm">Analyzing both products...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <div className="prose prose-purple prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed">
                <ReactMarkdown>{displayedText}</ReactMarkdown>
                
                {displayedText.length === insight.length && insight.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="mt-6 p-4 bg-amber-50 rounded-2xl flex items-start gap-3 border border-amber-100"
                  >
                    <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 m-0">
                      <strong>Always consult a doctor.</strong> This AI comparison is for educational purposes based on product labels and is not a substitute for professional medical advice.
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
