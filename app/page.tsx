import Image from "next/image";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import WhatsAppContact from "./WhatsAppContact";
import { readSiteContent } from "../lib/site-content";

const platformUrl = "https://cursos-matheus-vidal.vercel.app";
const siteUrl = "https://plataforma-theta-seven.vercel.app";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Ministério Matheus Vidal",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo-mv-contrast.png`,
        width: 121,
        height: 130
      },
      founder: { "@id": `${siteUrl}/#matheus-vidal` }
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Matheus Vidal",
      alternateName: "Ministério Matheus Vidal",
      inLanguage: "pt-BR",
      publisher: { "@id": `${siteUrl}/#organization` }
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Matheus Vidal | Pregador da Palavra e autor cristão",
      description: "Conheça o ministério de Matheus Vidal, pregador da Palavra ligado à Assembleia de Deus.",
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#matheus-vidal` },
      mainEntity: { "@id": `${siteUrl}/#matheus-vidal` }
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#matheus-vidal`,
      name: "Matheus Vidal",
      url: siteUrl,
      image: `${siteUrl}/autor-principal.png`,
      jobTitle: "Pregador da Palavra e autor cristão",
      description: "Pregador da Palavra ligado à Assembleia de Deus, autor cristão e professor de cursos bíblicos.",
      affiliation: { "@type": "Organization", name: "Assembleia de Deus" },
      worksFor: { "@id": `${siteUrl}/#organization` },
      knowsAbout: ["Pregação bíblica", "Assembleia de Deus", "Fé cristã", "Família", "Liderança cristã"],
      mainEntityOfPage: { "@id": `${siteUrl}/#webpage` }
    }
  ]
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readSiteContent();
  return <main className="institutional">
    <SiteHeader />
    <section id="inicio" className="person-hero shell"><div className="orbit" /><div className="orbit orbit-two" /><div className="person-copy"><p className="eyebrow"><span /> {content.hero.eyebrow}</p><h1><span>Matheus Vidal</span><br />{content.hero.title}</h1><p>{content.hero.description}</p><div className="actions"><a className="primary" href="#sobre">Conheça minha história <span>↓</span></a><a className="text-link" href="#contato">Consultar agenda <span>→</span></a></div></div><div className="person-photo"><div className="orange-halo" /><Image src={content.hero.image} fill sizes="(max-width: 850px) 100vw, 46vw" alt="Matheus Vidal, pregador da Palavra" priority unoptimized /><p>{content.hero.caption}</p></div></section>
    <section id="sobre" className="about-person"><div className="shell about-grid"><div><p className="eyebrow orange">{content.about.eyebrow}</p><h2>{content.about.title}</h2></div><div className="about-text"><p>{content.about.firstParagraph}</p><p>{content.about.secondParagraph}</p><div className="author-stats">{content.about.stats.map(stat => <div key={`${stat.value}-${stat.label}`}><b>{stat.value}</b><span>{stat.label}</span></div>)}</div></div></div></section>
    <section className="work-section shell"><div className="work-heading"><p className="eyebrow"><span /> {content.book.eyebrow}</p><h2>{content.book.title}</h2></div><article className="book-card"><div className="book-cover">{content.book.coverImage ? <Image src={content.book.coverImage} fill sizes="(max-width: 560px) 280px, 360px" alt={`Capa do livro ${content.book.title}`} unoptimized /> : <><small>UM LIVRO DE</small><b>MATHEUS<br />VIDAL</b><strong>FÉ</strong><span>que produz movimento</span></>}</div><div><p className="eyebrow orange">CONHEÇA A OBRA</p><h3>Uma mensagem para a caminhada</h3><p>{content.book.description}</p><a className="text-link" href="/livro">Conhecer e comprar o livro <span>→</span></a></div></article></section>
    <section className="store-teaser"><div className="shell store-teaser-grid"><div className="store-teaser-photo"><Image src={content.store.image} fill sizes="(max-width: 850px) 100vw, 52vw" alt="Camisetas cristãs da coleção MV" unoptimized /></div><div><p className="eyebrow gold">{content.store.eyebrow}</p><h2>{content.store.title}</h2><p>{content.store.description}</p><a className="primary" href="/loja">Entrar na loja <span>→</span></a></div></div></section>
    <section id="cursos" className="courses-bridge"><div className="shell bridge-grid"><div><p className="eyebrow orange">{content.school.eyebrow}</p><h2>{content.school.title}</h2><p>{content.school.description}</p><a className="primary" href={platformUrl}>Abrir a plataforma de cursos <span>↗</span></a></div><div className="platform-preview"><div className="preview-top"><span /><span /><span /></div><p>PLATAFORMA MATHEUS VIDAL</p><h3>Aprenda no seu ritmo.</h3><div className="preview-progress"><span /></div><small>Conteúdo · Exercícios · Progresso</small></div></div></section>
    <WhatsAppContact />
    <SiteFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  </main>;
}
