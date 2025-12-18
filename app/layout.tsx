import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Customer Support Hub - Asset Management",
  description: "Internal Company Asset Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-slate-950 text-slate-50">
        <div className="motion-bg" />
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="flex-1 flex items-start justify-center px-4 py-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

