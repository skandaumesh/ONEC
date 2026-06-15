import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
 const [theme, setTheme] = useState(() => {
 const stored = localStorage.getItem('onec_theme');
 return stored || 'light';
 });

 useEffect(() => {
 document.documentElement.setAttribute('data-theme', theme);
 localStorage.setItem('onec_theme', theme);
 }, [theme]);

 const toggleTheme = () => {
 setTheme(prev => prev === 'light' ? 'dark' : 'light');
 };

 return (
 <ThemeContext.Provider value={{ theme, toggleTheme }}>
 {children}
 </ThemeContext.Provider>
 );
}

export function useTheme() {
 const context = useContext(ThemeContext);
 if (!context) throw new Error('useTheme must be used within ThemeProvider');
 return context;
}

export default ThemeContext;
