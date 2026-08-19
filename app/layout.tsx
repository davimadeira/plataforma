import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreCartProvider } from "./StoreCart";
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase: new URL("https://plataforma-theta-seven.vercel.app"),
  applicationName: "Matheus Vidal",
  title: { default: "Matheus Vidal | Pregador da Palavra e autor cristão", template: "%s | Matheus Vidal" },
  description: "Conheça o ministério de Matheus Vidal, pregador da Palavra ligado à Assembleia de Deus. Encontre mensagens bíblicas, livro, cursos e agenda.",
  keywords: ["Matheus Vidal", "pregador Matheus Vidal", "pregador da Palavra", "Assembleia de Deus", "mensagens bíblicas", "livro cristão", "cursos cristãos"],
  alternates: { canonical: "/", languages: { "pt-BR": "/" } },
  authors: [{ name: "Matheus Vidal" }],
  creator: "Matheus Vidal",
  publisher: "Ministério Matheus Vidal",
  category: "Religião e espiritualidade",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 }
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Matheus Vidal",
    url: "/",
    title: "Matheus Vidal | Pregador da Palavra",
    description: "Conheça o ministério de Matheus Vidal, pregador da Palavra ligado à Assembleia de Deus, seus livros, cursos e agenda.",
    images: [{ url: "/autor-principal.png", width: 853, height: 1280, alt: "Matheus Vidal, pregador da Palavra" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Matheus Vidal | Pregador da Palavra",
    description: "Mensagens bíblicas, livro, cursos cristãos e agenda de ministrações.",
    images: ["/autor-principal.png"]
  }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body className={`${geist.variable} ${mono.variable}`}><StoreCartProvider>{children}</StoreCartProvider></body></html>; }
