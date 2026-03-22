import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "茶録 - Charoku",
  description: "茶道のお稽古を深める、あなたの稽古帳アプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "茶録",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#7B8F6B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#FAFAF8" }}>
        {children}
      </body>
    </html>
  );
}
