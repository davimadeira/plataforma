import type { Metadata } from "next";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import Store from "../Store";
import WhatsAppContact from "../WhatsAppContact";

export const metadata: Metadata = {
  title: "Loja MV | Camisetas cristãs",
  description: "Conheça a Loja MV e encontre camisetas cristãs com estampas sobre Jesus, fé, família e propósito, disponíveis em diferentes cores e tamanhos.",
  alternates: { canonical: "/loja" },
  openGraph: {
    title: "Loja MV | Camisetas cristãs",
    description: "Camisetas cristãs para vestir sua fé e expressar propósito.",
    url: "/loja",
    images: [{ url: "/store/jesus-casal.png", width: 1254, height: 1254, alt: "Coleção de camisetas cristãs MV" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Loja MV | Camisetas cristãs",
    description: "Camisetas cristãs para vestir sua fé e expressar propósito.",
    images: ["/store/jesus-casal.png"]
  }
};

export default function StorePage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Store",
        "@id": "https://plataforma-theta-seven.vercel.app/loja#store",
        name: "Loja MV",
        description: "Loja de camisetas cristãs de Matheus Vidal, Lais e Antonella.",
        url: "https://plataforma-theta-seven.vercel.app/loja",
        image: "https://plataforma-theta-seven.vercel.app/store/jesus-casal.png",
        logo: "https://plataforma-theta-seven.vercel.app/logo-mv-contrast.png"
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: "https://plataforma-theta-seven.vercel.app" },
          { "@type": "ListItem", position: 2, name: "Loja MV", item: "https://plataforma-theta-seven.vercel.app/loja" }
        ]
      }
    ]
  };
  return <main className="institutional inner-page"><SiteHeader active="loja" /><Store /><WhatsAppContact /><SiteFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></main>;
}
