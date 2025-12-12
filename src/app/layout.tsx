import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TeamFlow - Modern Team Collaboration Platform",
  description: "Professional task management and team collaboration platform. Built with Next.js, TypeScript, and modern web technologies by VKV - New vision.",
  keywords: ["TeamFlow", "collaboration", "task management", "project management", "team productivity", "Next.js", "React"],
  authors: [{ name: "Valerii Karpov" }],
  creator: "Valerii Karpov",
  publisher: "VKV - New vision",
  metadataBase: new URL("https://teamflow.vkvstudio.pro"),
    icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "TeamFlow - Modern Team Collaboration Platform",
    description: "Professional task management and team collaboration platform",
    url: "https://teamflow.vkvstudio.pro",
    siteName: "TeamFlow",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TeamFlow - Modern Team Collaboration Platform",
    description: "Professional task management and team collaboration platform",
  },className={`${g flex flex-col min-h-screengeistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}  className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen antialiased bg-background text-foreground`}
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${g flex flex-col min-h-screeneistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <main className="flex-grow">
          {children}
                  </main>
        <Toaster />
                <footer className="mt-auto border-t py-6 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                © {new Date().getFullYear()} VKV - New vision. Created by Valerii Karpov. All rights reserved.              </div>
              <nav className="flex gap-6 text-sm">
                <a href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms-of-service" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </a>
                <a href="/api/gdpr/export" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Export My Data
                </a>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
