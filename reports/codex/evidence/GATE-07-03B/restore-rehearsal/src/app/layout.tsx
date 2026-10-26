import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Shell from "@/components/layout/Shell";
import { TransitionProvider } from "@/context/TransitionContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HUẾ TRAVEL PRO — Huế có chi hay?",
  description: "Website cẩm nang du lịch Huế dành cho khách du lịch tự túc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <TransitionProvider>
          <Shell>{children}</Shell>
        </TransitionProvider>
      </body>
    </html>
  );
}
