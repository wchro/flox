import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "flox — streaming as code",
  description:
    "flox is an open source VOD (Video On Demand) platform developed by Wilson (@wchro) with the aim of improving my skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${InterFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
