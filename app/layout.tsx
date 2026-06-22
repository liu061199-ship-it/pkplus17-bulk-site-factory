import type { Metadata } from "next";
import Link from "next/link";
import { siteConfigs } from "@/lib/site-data";
import "./globals.css";

const authUrl = siteConfigs[0]?.authUrl || siteConfigs[0]?.downloadUrl || "/";

export const metadata: Metadata = {
  title: "Bulk Site Factory",
  description: "Generate multiple static websites from JSON configuration"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="border-b border-line bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <Link href="/" className="font-bold text-ink">
              Bulk Site Factory
            </Link>
            <nav className="flex items-center gap-3 text-sm text-slate-600">
              <Link href="/">Sites</Link>
              <a href={authUrl} className="rounded-lg border border-line px-3 py-2 font-semibold text-ink" rel="nofollow">
                Login
              </a>
              <a href={authUrl} className="rounded-lg bg-ink px-3 py-2 font-semibold text-white" rel="nofollow">
                Register
              </a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
