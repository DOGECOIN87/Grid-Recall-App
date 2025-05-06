import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Use Inter font for better readability
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'GridRecall - Memory Game Assistant',
  description: 'Assist in memorizing sequences for memory games.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">{/* Apply dark theme by default */}
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        {children}
        <Toaster />{/* Add Toaster for notifications */}
      </body>
    </html>
  );
}
