import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, userApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 const [user, setUser] = useState(null);
 const [token, setToken] = useState(localStorage.getItem('onec_token'));
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const storedUser = localStorage.getItem('onec_user');
 if (storedUser && token) {
 setUser(JSON.parse(storedUser));
 }
 setLoading(false);
 }, [token]);

 const login = useCallback(async (credentials) => {
 const response = await authApi.login(credentials);
 const { data } = response.data;
 localStorage.setItem('onec_token', data.token);
 localStorage.setItem('onec_user', JSON.stringify(data));
 setToken(data.token);
 setUser(data);
 return data;
 }, []);

 const register = useCallback(async (userData) => {
 const response = await authApi.register(userData);
 const { data } = response.data;
 localStorage.setItem('onec_token', data.token);
 localStorage.setItem('onec_user', JSON.stringify(data));
 setToken(data.token);
 setUser(data);
 return data;
 }, []);

 const logout = useCallback(() => {
 localStorage.removeItem('onec_token');
 localStorage.removeItem('onec_user');
 setToken(null);
 setUser(null);
 }, []);

 const isAuthenticated = !!token && !!user;
 const isAdmin = user?.role === 'ADMIN';

 return (
 <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated, isAdmin }}>
 {children}
 </AuthContext.Provider>
 );
}

export function useAuth() {
 const context = useContext(AuthContext);
 if (!context) throw new Error('useAuth must be used within AuthProvider');
 return context;
}

export default AuthContext;
