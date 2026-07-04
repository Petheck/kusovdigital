import "./globals.css";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";

const display = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Kusov Digital — Video obhliadky a digitálna premena priestorov",
  description:
    "Cinematic UGC video obhliadky nehnuteľností a digitálna premena prázdnych priestorov na zariadené. Pre realitných agentov a developerov.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
