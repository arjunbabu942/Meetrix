import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

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
    <html lang="en">
      <body className="bg-[#020617] text-[#E5E7EB] antialiased">
        <div className="flex min-h-screen bg-[#020617]">
          <Sidebar />

          <div className="flex flex-1 flex-col min-h-screen bg-[#020617]">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 bg-[#020617]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}