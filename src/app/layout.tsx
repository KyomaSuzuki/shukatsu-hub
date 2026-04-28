import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "ShuKATSU Hub",
  description: "就活管理アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="app-layout">
          <Sidebar />
          <Header />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
