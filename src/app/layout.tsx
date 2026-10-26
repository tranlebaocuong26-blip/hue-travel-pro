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

const notoSans = localFont({
  src: [
    { path: "./fonts/NotoSans-VF.ttf", style: "normal" },
    { path: "./fonts/NotoSans-Italic-VF.ttf", style: "italic" },
  ],
  variable: "--font-ui",
  weight: "100 900",
  display: "swap",
  preload: false,
});

const beVietnamPro = localFont({
  src: [
    { path: "./fonts/BeVietnamPro-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/BeVietnamPro-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/BeVietnamPro-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/BeVietnamPro-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/BeVietnamPro-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-be-vietnam",
  display: "swap",
  preload: false,
});

const notoSerif = localFont({
  src: "./fonts/NotoSerif-VF.ttf",
  variable: "--font-editorial",
  weight: "100 900",
  style: "normal",
  display: "swap",
  preload: false,
});

const playfair = localFont({
  src: "./fonts/PlayfairDisplay-VF.ttf",
  variable: "--font-playfair",
  weight: "400 900",
  display: "swap",
  preload: false,
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
      <body className={`${geistSans.variable} ${notoSans.variable} ${beVietnamPro.variable} ${notoSerif.variable} ${playfair.variable} font-ui antialiased`}>
        <TransitionProvider>
          <Shell>{children}</Shell>
        </TransitionProvider>
      </body>
    </html>
  );
}
