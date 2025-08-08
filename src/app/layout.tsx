"use client";

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
