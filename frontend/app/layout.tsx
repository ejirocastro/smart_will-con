// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SmartWill - Secure Your Digital Legacy',
  description: 'Create, manage, and execute digital wills with blockchain technology. Ensure your assets reach the right people at the right time.',
  keywords: ['digital will', 'blockchain', 'inheritance', 'estate planning', 'crypto assets'],
  authors: [{ name: 'SmartWill Team' }],
  openGraph: {
    title: 'SmartWill - Secure Your Digital Legacy',
    description: 'Create, manage, and execute digital wills with blockchain technology.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartWill - Secure Your Digital Legacy',
    description: 'Create, manage, and execute digital wills with blockchain technology.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1f2937',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}