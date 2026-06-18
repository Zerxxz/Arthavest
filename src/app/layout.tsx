import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SuiProvider } from "@/components/providers/SuiProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arthavest — Investasi UMKM Indonesia berbasis SuiStream",
  description: "Platform kepemilikan fraksional UMKM Indonesia. Profit bulanan mengalir otomatis ke investor via SuiStream primitive di jaringan Sui.",
  keywords: ["Sui", "SuiStream", "UMKM", "investasi", "RWA", "hackathon", "Sui Overflow", "Arthavest"],
  authors: [{ name: "Arthavest Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Arthavest — Investasi UMKM Indonesia",
    description: "Profit bulanan mengalir otomatis ke investor via SuiStream di jaringan Sui.",
    siteName: "Arthavest",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SuiProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </SuiProvider>
      </body>
    </html>
  );
}
