import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KCL Shop",
  description: "Next.js App Router で学ぶシンプルなショッピングアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
