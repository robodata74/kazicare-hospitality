import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import KeziahAssistant from "@/components/KeziahAssistant";

export const metadata: Metadata = {
  title: {
    default: "KaziCare Hospitality",
    template: "%s | KaziCare Hospitality",
  },
  description:
    "Hospitality workforce management for restaurants, cafés, coffee houses and hotel restaurants.",
  applicationName: "KaziCare Hospitality",
  keywords: [
    "hospitality workforce management",
    "restaurant workforce",
    "employee management",
    "shift management",
    "attendance",
    "KaziCare",
  ],
  icons: {
    icon: [
      {
        url: "/branding/kazicare-mark.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="min-w-0 flex-1 bg-[var(--kc-background)]">
            {children}
          </main>
          <KeziahAssistant />
        </div>
      </body>
    </html>
  );
}