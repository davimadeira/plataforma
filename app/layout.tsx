import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreCartProvider } from "./StoreCart";
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase: new URL("https://plataforma-theta-seven.vercel.app"),
  title: { default: "Matheus Vidal | Pregador, autor, livros e cursos cristãos", template: "%s" },
  description: "Site oficial de Matheus Vidal: pregador, autor e palestrante. Conheça livros, cursos cristãos, a loja MV e consulte a agenda para eventos.",
  keywords: ["Matheus Vidal", "pregador Matheus Vidal", "livros cristãos", "cursos cristãos", "palestrante cristão", "loja MV", "camisetas cristãs"],
  alternates: { canonical: "/" },
  authors: [{ name: "Matheus Vidal" }],
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "pt_BR", siteName: "Matheus Vidal", url: "/", title: "Matheus Vidal | Livros, cursos e mensagens cristãs", description: "Pregador, autor e palestrante. Conheça livros, cursos, a loja MV e consulte a agenda.", images: [{ url: "/autor-principal.png", width: 853, height: 1280, alt: "Retrato de Matheus Vidal" }] },
  twitter: { card: "summary_large_image", title: "Matheus Vidal — uma mensagem que transforma", description: "Conheça a história, os livros e os cursos.", images: ["/autor-principal.png"] }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body className={`${geist.variable} ${mono.variable}`}><StoreCartProvider>{children}</StoreCartProvider></body></html>; }
