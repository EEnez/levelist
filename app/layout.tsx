import type { Metadata } from "next";
import { Geist, Geist_Mono } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Layout/Header";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import { GameProvider } from "@/contexts/GameContext";
import OnboardingGuide from '@/components/OnboardingGuide';

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
        <ThemeProvider>
          <GameProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <OnboardingGuide />
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
