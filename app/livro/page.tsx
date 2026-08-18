import type { Metadata } from "next";
import BookPurchase from "../BookPurchase";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import WhatsAppContact from "../WhatsAppContact";

export const metadata: Metadata = { title: "Livro de Matheus Vidal | Fé, propósito e transformação", description: "Conheça o livro de Matheus Vidal, leia os destaques da obra e simule sua compra online.", alternates: { canonical: "/livro" }, openGraph: { title: "Livro de Matheus Vidal", description: "Uma leitura cristã para transformar fé em movimento.", url: "/livro" } };

export default function BookPage() {
  const schema = { "@context": "https://schema.org", "@type": "Book", name: "Livro de Matheus Vidal", author: { "@type": "Person", name: "Matheus Vidal" }, inLanguage: "pt-BR", offers: { "@type": "Offer", priceCurrency: "BRL", price: "49.90", availability: "https://schema.org/InStock" } };
  return <main className="institutional inner-page"><SiteHeader active="livro" /><section className="inner-hero shell"><p className="eyebrow orange">LIVRO · MATHEUS VIDAL</p><h1>Livro de Matheus Vidal: fé para viver com propósito.</h1><p>Uma leitura cristã criada para levar a mensagem além do momento e transformar reflexão em atitude.</p></section><BookPurchase /><WhatsAppContact /><SiteFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></main>;
}

