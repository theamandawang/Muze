import type { Metadata } from "next";
import { DM_Sans, Instrument_Sans } from "next/font/google";
import MuzeHeader from "@/components/muze_header/header";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
})

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Muze",
  description: "Where listeners become storytellers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${instrumentSans.variable} antialiased`}
      >
        <div>
          <MuzeHeader />
        </div>
        <div>
        {children}
        </div>
      </body>
    </html>
  );
}
