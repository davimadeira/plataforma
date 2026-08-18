import type { Metadata } from "next";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import Store from "../Store";
import WhatsAppContact from "../WhatsAppContact";

export const metadata: Metadata = { title: "Loja MVLA | Camisetas cristãs de Matheus Vidal", description: "Compre camisetas cristãs MVLA com estampas exclusivas sobre Jesus, fé, família e propósito.", alternates: { canonical: "/loja" }, openGraph: { title: "Loja MVLA — roupas cristãs", description: "Camisetas cristãs para vestir sua fé e expressar propósito.", url: "/loja", images: [{ url: "/store/jesus-casal.png", width: 1254, height: 1254, alt: "Coleção de camisetas cristãs MVLA" }] } };

export default function StorePage() {
  const schema = { "@context": "https://schema.org", "@type": "Store", name: "Loja MVLA", description: "Loja de camisetas cristãs de Matheus Vidal, Lais e Antonella.", url: "https://plataforma-theta-seven.vercel.app/loja" };
  return <main className="institutional inner-page"><SiteHeader active="loja" /><Store /><WhatsAppContact /><SiteFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></main>;
}

