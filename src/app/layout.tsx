import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { MobileOnlyGate } from "@/components/mobile-only-gate";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SuraBank",
  description: "Comienza a manejar tu vida financiera",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn(inter.variable, poppins.variable)}>
      <body className="min-h-full font-sans">
        <Providers>
          <MobileOnlyGate>{children}</MobileOnlyGate>
        </Providers>
      </body>
    </html>
  );
}
