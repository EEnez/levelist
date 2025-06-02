import type { Metadata } from "next";
import { Geist, Geist_Mono } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Layout/Header";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import { GameProvider } from "@/contexts/GameContext";
import { ToastProvider } from "@/contexts/ToastContext";
import ToastContainer from "@/components/Toast/ToastContainer";
import OnboardingGuide from '@/components/OnboardingGuide';
import SaveStatusWrapper from '@/components/SaveStatus/SaveStatusWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "LevelList - Gaming Collection Tracker",
  description: "Track your video game collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          <ThemeProvider>
            <GameProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="fixed bottom-20 right-4 z-40">
                  <SaveStatusWrapper />
                </div>
                <Header />
                <main className="min-h-screen">
                  {children}
                </main>
                <OnboardingGuide />
              </div>
            </GameProvider>
          </ThemeProvider>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
