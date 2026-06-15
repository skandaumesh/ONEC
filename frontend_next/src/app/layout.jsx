import NavbarPro from '@/components/layout/NavbarPro';
import FooterPro from '@/components/layout/FooterPro';
import CartDrawer from '@/components/layout/CartDrawer';
import '../index.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import ToastContainer from '@/components/ToastProvider';

export const metadata = {
  title: 'ONEC Pharma',
  description: 'Your Health, Delivered Instantly',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&family=Dosis:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <div className="flex flex-col min-h-screen">
                  <NavbarPro />
                  <CartDrawer />
                  <main className="flex-grow">{children}</main>
                  <FooterPro />
                </div>
                <ToastContainer />
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}