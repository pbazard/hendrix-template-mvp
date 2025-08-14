import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QRArtistry MVP",
  description: "Create beautiful QR codes with artistic designs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ConfigureAmplifyClientSide />
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
