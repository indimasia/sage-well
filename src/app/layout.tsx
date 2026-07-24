import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sagewell.demo"),
  title: {
    default: "SageWell — HIPAA-compliant telehealth for independent therapists",
    template: "%s · SageWell",
  },
  description:
    "Run your practice. Protect your patients. Skip the spreadsheet. SageWell is a HIPAA-ready telehealth platform for independent therapists and small behavioral-health practices.",
  openGraph: {
    title: "SageWell — HIPAA-compliant telehealth",
    description:
      "Run your practice. Protect your patients. Skip the spreadsheet.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-paper text-ink">
        {/* Mark JS-capable before hydration so scroll-reveal only hides
            content when it can also un-hide it (no-JS renders fully visible). */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add('js')`}
        </Script>
        {children}
      </body>
    </html>
  );
}
