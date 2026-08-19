import type { Metadata } from "next";
import BookPurchase from "../BookPurchase";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import WhatsAppContact from "../WhatsAppContact";

export const metadata: Metadata = {
  title: "Livro cristão | Fé e propósito",
  description: "Conheça o livro de Matheus Vidal, com reflexões bíblicas para fortalecer a fé, aproximar o coração de Deus e viver com propósito.",
  alternates: { canonical: "/livro" },
  openGraph: {
    title: "Livro de Matheus Vidal | Fé e propósito",
    description: "Uma leitura cristã com reflexões bíblicas para fortalecer a caminhada com Deus.",
    url: "/livro",
    type: "book"
  },
  twitter: {
    card: "summary_large_image",
    title: "Livro de Matheus Vidal | Fé e propósito",
    description: "Reflexões bíblicas para fortalecer a caminhada com Deus."
  }
};

export default function BookPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Book",
        "@id": "https://plataforma-theta-seven.vercel.app/livro#book",
        name: "Livro de Matheus Vidal",
        url: "https://plataforma-theta-seven.vercel.app/livro",
        author: { "@id": "https://plataforma-theta-seven.vercel.app/#matheus-vidal" },
        inLanguage: "pt-BR",
        description: "Reflexões bíblicas para fortalecer a fé e viver o propósito de Deus."
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: "https://plataforma-theta-seven.vercel.app" },
          { "@type": "ListItem", position: 2, name: "Livro", item: "https://plataforma-theta-seven.vercel.app/livro" }
        ]
      }
    ]
  };
  return <main className="institutional inner-page"><SiteHeader active="livro" /><section className="inner-hero shell"><p className="eyebrow orange">LIVRO · MATHEUS VIDAL</p><h1>Uma leitura para fortalecer a fé e viver com propósito.</h1><p>Em seu livro, Matheus Vidal compartilha reflexões bíblicas para aproximar o coração de Deus e levar a Palavra às decisões de cada dia.</p></section><BookPurchase /><WhatsAppContact /><SiteFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></main>;
}
