import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

import { css } from "@styled-system/css";

import "./globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Local LLM Chat",
  description: "A chat application by Local LLM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <main
          className={css({
            height: "100vh",
            color: "text",
            fontWeight: "medium",
            fontSize: "md",
          })}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
