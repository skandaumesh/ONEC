import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function CartDrawer() {
 const { cart, loading, cartOpen, setCartOpen, updateQuantity, removeItem, clearCart, itemCount } = useCart();
 const { success } = useToast();
 const navigate = useNavigate();

 const items = cart?.items || [];
 const subtotal = cart?.totalPrice || items.reduce((sum, i) => sum + i.price * i.quantity, 0);
 const discount = cart?.totalDiscount || 0;
 const deliveryFee = subtotal >= 499 ? 0 : 49;
 const total = subtotal - discount + deliveryFee;

 const handleRemove = async (itemId, name) => {
 await removeItem(itemId);
 success(`${name} removed from cart`);
 };

 const handleCheckout = () => {
 setCartOpen(false);
 navigate('/checkout');
 };

 return (
 <AnimatePresence>
 {cartOpen && (
 <>
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
 onClick={() => setCartOpen(false)}
 />

 {/* Drawer */}
 <motion.div
 initial={{ x: '100%' }}
 animate={{ x: 0 }}
 exit={{ x: '100%' }}
 transition={{ type: 'spring', stiffness: 350, damping: 35 }}
 className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-[70] flex flex-col frosted-glass border-l border-slate-200/50 shadow-2xl"
 >
 {/* Header */}
 <div className="flex items-center justify-between p-5 border-b border-slate-200/50 ">
 <div className="flex items-center gap-3">
 <ShoppingCart size={22} className="text-[#FF6F61]" />
 <h2 className="text-lg font-black text-[#102A43] ">
 Your Cart
 </h2>
 {itemCount > 0 && (
 <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FF6F61]/10 text-[#FF6F61] shadow-sm">
 {itemCount} {itemCount === 1 ? 'item' : 'items'}
 </span>
 )}
 </div>
 <button
 onClick={() => setCartOpen(false)}
 className="p-2 rounded-xl hover:bg-[#FFF3F2] transition-colors cursor-pointer"
 >
 <X size={20} className="text-slate-650 " />
 </button>
 </div>

 {/* Content */}
 {items.length === 0 ? (
 /* Empty State */
 <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
 <motion.div
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ delay: 0.1 }}
 >
 <div className="w-24 h-24 rounded-3xl bg-[#FF6F61]/10 flex items-center justify-center mx-auto mb-6 shadow-sm">
 <ShoppingBag size={40} className="text-[#FF6F61] animate-bounce-gentle" />
 </div>
 <h3 className="text-xl font-black text-[#102A43] mb-2">
 Your cart is empty
 </h3>
 <p className="text-xs font-bold text-slate-500 mb-6 leading-relaxed max-w-[250px] mx-auto">
 Looks like you haven't added any medicines yet. Explore our products!
 </p>
 <Link
 to="/products"
 onClick={() => setCartOpen(false)}
 className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FF6F61] hover:bg-[#E05A4D] text-white font-black text-xs shadow-md hover:shadow-lg transition-all btn-shine"
 >
 Browse Products <ArrowRight size={16} />
 </Link>
 </motion.div>
 </div>
 ) : (
 <>
 {/* Items List */}
 <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
 <AnimatePresence>
 {items.map((item, index) => (
 <motion.div
 key={item.id || index}
 layout
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, x: 100 }}
 transition={{ delay: index * 0.05 }}
 className="flex gap-3.5 p-4 rounded-2xl bg-white/60 border border-slate-200/50 shadow-sm"
 >
 {/* Image */}
 <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 flex items-center justify-center p-1.5 border border-slate-100 ">
 <img
 src={item.imageUrl || item.productImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100'}
 alt={item.productName || item.name}
 className="max-h-full max-w-full object-contain mix-blend-multiply "
 onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100'; }}
 />
 </div>

 {/* Info */}
 <div className="flex-1 min-w-0">
 <h4 className="text-xs font-black truncate text-[#102A43] ">
 {item.productName || item.name}
 </h4>
 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
 {item.manufacturer || 'Pharma'}
 </p>
 <div className="flex items-center justify-between mt-2.5">
 <span className="text-sm font-black text-[#FF6F61]">
 ₹{((item.price || item.sellingPrice || 0) * item.quantity).toFixed(2)}
 </span>
 {/* Quantity Controls */}
 <div className="flex items-center gap-1.5 bg-white/40 p-0.5 rounded-lg border border-slate-200/50 ">
 <button
 onClick={() => {
 if (item.quantity <= 1) handleRemove(item.id, item.productName || item.name);
 else updateQuantity(item.id, item.quantity - 1);
 }}
 className="w-6 h-6 rounded-md flex items-center justify-center transition-colors bg-white hover:bg-[#FF6F61]/15 border border-slate-200/50 cursor-pointer"
 >
 <Minus size={12} className="text-slate-600 " />
 </button>
 <span className="w-6 text-center text-xs font-black text-[#102A43] ">
 {item.quantity}
 </span>
 <button
 onClick={() => updateQuantity(item.id, item.quantity + 1)}
 className="w-6 h-6 rounded-md flex items-center justify-center transition-colors bg-white hover:bg-[#FF6F61]/15 border border-slate-200/50 cursor-pointer"
 >
 <Plus size={12} className="text-slate-600 " />
 </button>
 </div>
 </div>
 </div>

 {/* Remove */}
 <button
 onClick={() => handleRemove(item.id, item.productName || item.name)}
 className="self-start p-1.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
 >
 <Trash2 size={13} />
 </button>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>

 {/* Footer Summary */}
 <div className="border-t border-slate-200/50 p-5 space-y-4 bg-white/80 #141D2F]/80 backdrop-blur-xl">
 <div className="space-y-2">
 <div className="flex justify-between text-xs font-bold text-slate-500 ">
 <span>Subtotal</span>
 <span className="text-slate-800 ">₹{subtotal.toFixed(2)}</span>
 </div>
 {discount > 0 && (
 <div className="flex justify-between text-xs font-bold text-slate-500 ">
 <span>Discount</span>
 <span className="text-green-600">-₹{discount.toFixed(2)}</span>
 </div>
 )}
 <div className="flex justify-between text-xs font-bold text-slate-500 ">
 <span>Delivery</span>
 <span className={deliveryFee === 0 ? 'text-green-600' : 'text-slate-800 '}>
 {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
 </span>
 </div>
 <div className="flex justify-between text-base font-black pt-3 border-t border-slate-200/50 ">
 <span className="text-[#102A43] ">Total</span>
 <span className="text-[#FF6F61]">₹{total.toFixed(2)}</span>
 </div>
 </div>

 {subtotal < 499 && (
 <p className="text-[10px] font-black text-center py-2 px-3 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/10 animate-pulse">
 Add ₹{(499 - subtotal).toFixed(0)} more for FREE delivery!
 </p>
 )}

 <button
 onClick={handleCheckout}
 className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all btn-shine cursor-pointer"
 >
 Proceed to Checkout <ArrowRight size={16} />
 </button>

 <button
 onClick={() => { clearCart(); success('Cart cleared'); }}
 className="w-full py-2 text-xs text-red-500 font-extrabold hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
 >
 Clear Cart
 </button>
 </div>
 </>
 )}
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
}
