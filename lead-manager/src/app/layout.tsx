import type { Metadata } from "next";
import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // prevent duplicate CSS injection

export const metadata: Metadata = {
  title: "Lead Manager",
  description: "Public lead form + internal leads list",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#ffffffff", color: "#111" }}>
        <div>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
