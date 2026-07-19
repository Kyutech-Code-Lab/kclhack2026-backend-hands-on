import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KCL Shop",
  description: "ハンズオンで学ぶシンプルなショッピングアプリ",
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
