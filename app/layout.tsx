import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Layout/Header";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import { GameProvider } from "@/contexts/GameContext";

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
      <body className="antialiased transition-colors duration-300">
        <ThemeProvider>
          <GameProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
