import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Lead Manager",
  description: "Public lead form + internal leads list",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable + " app-body"}>
        <div>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
