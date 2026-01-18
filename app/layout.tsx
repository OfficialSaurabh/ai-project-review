import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Project Analyzer",
    template: "%s | AI Project Analyzer",
  },
  description: "Analyze GitHub and Bitbucket repositories with AI. Automated code quality checks, security audits, architecture visualization, and performance insights in one powerful developer platform.",
  metadataBase: new URL("https://ai-project-review.vercel.app/"),
  openGraph: {
    title: "AI Project Analyzer",
    description: "Analyze GitHub and Bitbucket repositories with AI-powered code insights.",
    url: "https://ai-project-review.vercel.app/",
    siteName: "AI Project Analyzer",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>{children}
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
