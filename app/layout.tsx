import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./globals.css";

const fieldworkDemiBold = localFont({
  src: "./font/5A Fieldwork_GEO_DemiBold.otf",
  variable: "--font-heading",
});

const fieldworkRegular = localFont({
  src: "./font/4A Fieldwork_GEO_Regular.otf",
  variable: "--font-body",
});

const fieldworkThin = localFont({
  src: "./font/2A Fieldwork_GEO_Thin.otf",
  variable: "--font-caption",
});

export const metadata: Metadata = {
  title: "Castrol Battery Warranty Portal",
  description: "Register and manage battery warranties with Castrol",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fieldworkDemiBold.variable} ${fieldworkRegular.variable} ${fieldworkThin.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground">
        <ThemeProvider>
          <ErrorBoundary>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
