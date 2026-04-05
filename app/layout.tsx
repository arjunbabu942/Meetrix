import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meetrix",
  description: "AI-Powered Meeting Intelligence Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} bg-[#1C1F24] text-[#F8FAFC]`}>
      <body className="min-h-screen bg-[#1C1F24] text-[#F8FAFC] antialiased">
        <div className="flex min-h-screen bg-[#1C1F24]">
          <Sidebar />

          <div className="flex min-h-screen flex-1 flex-col bg-[#1C1F24]">
            <Navbar />

            <main className="mx-auto w-full max-w-7xl flex-1 bg-[#1C1F24] px-4 py-6 md:px-8 md:py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}