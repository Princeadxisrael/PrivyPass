import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./wallet-adapter.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Private Pass | Prove Your Holdings Privately on Solana",
  description: "Token-gated access with zero-knowledge proofs on Solana. Prove your holdings without revealing your balance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}