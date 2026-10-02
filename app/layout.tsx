import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';

export const metadata: Metadata = {
  title: 'The Roastery Club',
  description: 'Artisanal coffee roastery, hand-crafted specialty brews, bakery pairings, table reservations, and digital ordering.',
  openGraph: {
    title: 'The Roastery Club',
    description: 'Artisanal coffee roastery, hand-crafted specialty brews, bakery pairings, table reservations, and digital ordering.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Roastery Club',
    description: 'Artisanal coffee roastery, hand-crafted specialty brews, bakery pairings, table reservations, and digital ordering.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#fbf7ee] text-[#2c1810] min-h-screen">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
