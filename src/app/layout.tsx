import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ConfigureAmplify, AwsResourcesManager } from "@/components/shared";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hendrix MVP Template",
  description: "A modern Next.js template for rapid MVP development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplify />
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <AwsResourcesManager className="mt-auto" />
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
