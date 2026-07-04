import "./globals.css";
import { Bricolage_Grotesque, Inter } from "next/font/google";

const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata = {
  title: "Kusov Digital — Digitálne riešenia pre reality",
  description:
    "Tvorba webstránok, cinematic videí a digitálna premena priestorov pre realitných agentov a developerov. Prémiový obsah, ktorý predáva.",
  openGraph: {
    title: "Kusov Digital — Digitálne riešenia pre reality",
    description:
      "Weby, cinematic videá a digitálna premena priestorov pre reality.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
