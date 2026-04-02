import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code Complexity Estimator",
  description: "Analyze code complexity locally using simple string parsing logic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen pt-20 flex flex-col`}>
        <Navbar />
        <main className="grow max-w-6xl mx-auto w-full px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
