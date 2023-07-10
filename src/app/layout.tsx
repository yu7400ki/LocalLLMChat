import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

import "./globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Local LLM Chat",
  description: "A chat application by Local LLM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>{children}</body>
    </html>
  );
}
