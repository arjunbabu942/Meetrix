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
      <body className="bg-[#0B1120] text-white">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}