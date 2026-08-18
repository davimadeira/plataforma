import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Matheus Vidal — pregador, autor e palestrante",
  description: "Conheça a trajetória, os livros, cursos e entre em contato para palestras e eventos.",
  openGraph: { title: "Matheus Vidal — uma mensagem que transforma", description: "Pregador, autor e palestrante. Conheça sua história, livros e cursos.", images: [{ url: "/autor-principal.png", width: 853, height: 1280, alt: "Retrato de Matheus Vidal" }] },
  twitter: { card: "summary_large_image", title: "Matheus Vidal — uma mensagem que transforma", description: "Conheça a história, os livros e os cursos.", images: ["/autor-principal.png"] }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>; }
