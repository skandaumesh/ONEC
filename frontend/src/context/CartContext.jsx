import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cartApi } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
 const { isAuthenticated } = useAuth();
 const [cart, setCart] = useState(null);
 const [loading, setLoading] = useState(false);
 const [cartOpen, setCartOpen] = useState(false);

 const fetchCart = useCallback(async () => {
 if (!isAuthenticated) return;
 try {
 setLoading(true);
 const response = await cartApi.get();
 setCart(response.data.data);
 } catch (error) {
 console.error('Failed to fetch cart:', error);
 } finally {
 setLoading(false);
 }
 }, [isAuthenticated]);

 useEffect(() => {
 if (isAuthenticated) {
 fetchCart();
 } else {
 setCart(null);
 }
 }, [isAuthenticated, fetchCart]);

 const addItem = useCallback(async (productId, quantity = 1) => {
 try {
 const response = await cartApi.addItem({ productId, quantity });
 setCart(response.data.data);
 setCartOpen(true);
 return true;
 } catch (error) {
 console.error('Failed to add item:', error);
 return false;
 }
 }, []);

 const updateQuantity = useCallback(async (itemId, quantity) => {
 try {
 const response = await cartApi.updateQuantity(itemId, quantity);
 setCart(response.data.data);
 } catch (error) {
 console.error('Failed to update quantity:', error);
 }
 }, []);

 const removeItem = useCallback(async (itemId) => {
 try {
 const response = await cartApi.removeItem(itemId);
 setCart(response.data.data);
 } catch (error) {
 console.error('Failed to remove item:', error);
 }
 }, []);

 const clearCart = useCallback(async () => {
 try {
 const response = await cartApi.clear();
 setCart(response.data.data);
 } catch (error) {
 console.error('Failed to clear cart:', error);
 }
 }, []);

 const itemCount = cart?.totalItems || 0;

 return (
 <CartContext.Provider value={{
 cart, loading, cartOpen, setCartOpen, itemCount,
 addItem, updateQuantity, removeItem, clearCart, fetchCart
 }}>
 {children}
 </CartContext.Provider>
 );
}

export function useCart() {
 const context = useContext(CartContext);
 if (!context) throw new Error('useCart must be used within CartProvider');
 return context;
}

export default CartContext;
