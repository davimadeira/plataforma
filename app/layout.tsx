import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Acenda — ideias que saem do papel",
  description: "Conheça o livro Acenda, o autor e a experiência de estudos que transforma conhecimento em ação.",
  openGraph: { title: "Acenda — ideias que saem do papel", description: "Livro, curso e uma experiência para transformar conhecimento em ação.", images: [{ url: "/og.png", width: 1734, height: 909 }] },
  twitter: { card: "summary_large_image", title: "Acenda — ideias que saem do papel", description: "Livro, curso e uma experiência para transformar conhecimento em ação.", images: ["/og.png"] }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>; }
