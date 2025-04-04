import type { Metadata } from "next";
import { Lilita_One } from "next/font/google";
import "./globals.css";

const lilitaOne = Lilita_One({
  variable: "--font-lilita-one",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lilitaOne.variable} antialiased`}>{children}</body>
    </html>
  );
}
