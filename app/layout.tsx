import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'], weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'CompetencyOS - Hệ thống Quản lý Khung năng lực',
  description: 'Hệ thống quản lý khung năng lực, đánh giá nhân sự và báo cáo AI cho doanh nghiệp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
