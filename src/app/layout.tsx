import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/layout/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Finora — Tu Finanzas, Simplificadas',
    template: '%s | Finora',
  },
  description:
    'Gestiona tus finanzas personales de forma simple. Registra gastos, controla deudas, ahorra con metas visuales y gestiona suscripciones.',
  keywords: [
    'finanzas personales',
    'control de gastos',
    'ahorro',
    'presupuesto',
    'deudas',
    'suscripciones',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
