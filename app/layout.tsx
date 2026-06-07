import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RunIQ – Shoe Performance Optimizer",
  description:
    "Vergelijk hardloopschoenen op basis van jouw persoonlijke lopersdata en performance-impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" style={{ colorScheme: "dark" }}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
