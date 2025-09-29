import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/auth-provider";
import { FeatureFlagProvider } from "@/components/providers/feature-flag-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { MonitoringProvider } from "@/components/providers/monitoring-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rockket - Launch Your Vision",
  description:
    "Turn your ideas into production-ready applications without the complexity, coding headaches, or months of development time.",
  keywords: [
    "SaaS",
    "Multi-tenant",
    "AI-powered",
    "Visual Builder",
    "CMS",
    "E-commerce",
  ],
  authors: [{ name: "Rockket Team" }],
  creator: "Rockket",
  publisher: "Rockket",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Rockket - Launch Your Vision",
    description:
      "Turn your ideas into production-ready applications without the complexity, coding headaches, or months of development time.",
    siteName: "Rockket",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rockket - Launch Your Vision",
    description:
      "Turn your ideas into production-ready applications without the complexity, coding headaches, or months of development time.",
    creator: "@rockket",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <FeatureFlagProvider>
              <AnalyticsProvider>
                <MonitoringProvider>
                  {children}
                  <Toaster />
                </MonitoringProvider>
              </AnalyticsProvider>
            </FeatureFlagProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
