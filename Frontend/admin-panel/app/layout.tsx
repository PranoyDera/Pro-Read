import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import {
  SidebarProvider,
  SidebarInset,
} from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/layout/app-sidebar";

import { AdminLayoutShell } from "@/app/components/layout/admin-layout-shell";
import { Toaster } from "@/app/components/ui/toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pro-Read Admin Portal",
  description: "Administrative console and story management for Pro-Read",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-neutral-100 text-neutral-900 selection:bg-neutral-900 selection:text-white">
        <AdminLayoutShell>{children}</AdminLayoutShell>
        <Toaster />
      </body>
    </html>
  );
}
