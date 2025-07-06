import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";

import Navbar from "./Components/Common/Header";
import Footer from "./Components/Common/Footer";
import Chatbot from "./AI/page";
import Providers from "./Redux/Provider/provider";
import Script from "next/script";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Galli Mall",
  description: "Galli Mall is an E-Commerce website for buying and selling products digitally from local vendors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${fontSans.variable} antialiased`}>
        <Providers>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Chatbot />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
