import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Cafex | Artisan Roastery, Pastries & Online Ordering',
  description: 'Experience handcrafted single-origin coffees, ceremonial matcha, European pastries, and fresh bistro favorites with instant table reservations and lightning-fast delivery.',
  manifest: '/manifest.json',
  keywords: ['cafe', 'coffee roastery', 'artisan bakery', 'online ordering', 'table reservation', 'matcha', 'cold brew', 'croissant'],
  authors: [{ name: 'Cafex Artisan Roastery' }],
  openGraph: {
    title: 'Cafex | Artisan Roastery & Bistro',
    description: 'Crafted with passion, roasted to perfection. Single-origin coffees, handcrafted pastries, and online ordering.',
    url: 'https://cafex.vercel.app',
    siteName: 'Cafex',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Cafex Artisan Espresso and Ambience',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#d97706',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <CartDrawer />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
