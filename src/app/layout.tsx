import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SuiProvider } from "@/components/providers/SuiProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SahamKita — Investasi UMKM Indonesia berbasis SuiStream",
  description: "Platform kepemilikan fraksional UMKM Indonesia. Profit bulanan mengalir otomatis ke investor via SuiStream primitive di jaringan Sui.",
  keywords: ["Sui", "SuiStream", "UMKM", "investasi", "RWA", "hackathon", "Sui Overflow"],
  authors: [{ name: "SahamKita Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "SahamKita — Investasi UMKM Indonesia",
    description: "Profit bulanan mengalir otomatis ke investor via SuiStream di jaringan Sui.",
    siteName: "SahamKita",
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
          {children}
          <Toaster />
        </SuiProvider>
      </body>
    </html>
  );
}
