import ErrorBoundary from "@/utils/ErrorBoundry";
import type { Metadata, Viewport } from "next";
import { PT_Sans, Raleway } from "next/font/google";
import "../../src/index.scss";
import { I18nProvider } from "./i18n/i18n-context";
import { detectLanguage } from "./i18n/server";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-pt-sans",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "CiensMart",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lng = await detectLanguage();
  return (
      <html lang='en'>
        <body className={`${ptSans.variable} ${raleway.variable}`}>
          <I18nProvider language={lng}>
          <ErrorBoundary>{children}</ErrorBoundary>
          </I18nProvider>
        </body>
      </html>
  );
}
