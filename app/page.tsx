import Image from "next/image";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import WhatsAppContact from "./WhatsAppContact";

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

export default function Home() {
  return <main className="institutional">
    <SiteHeader />
    <section id="inicio" className="person-hero shell"><div className="orbit" /><div className="orbit orbit-two" /><div className="person-copy"><p className="eyebrow"><span /> PREGADOR DA PALAVRA · AUTOR</p><h1><span>Matheus Vidal</span><br />Uma vida dedicada <em>à Palavra de Deus.</em></h1><p>Matheus Vidal é pregador da Palavra, ligado à Assembleia de Deus. Seu ministério anuncia o Evangelho com mensagens bíblicas que fortalecem a fé, edificam famílias e conduzem vidas ao propósito de Deus.</p><div className="actions"><a className="primary" href="#sobre">Conheça minha história <span>↓</span></a><a className="text-link" href="#contato">Consultar agenda <span>→</span></a></div></div><div className="person-photo"><div className="orange-halo" /><Image src="/autor-principal.png" fill sizes="(max-width: 850px) 100vw, 46vw" alt="Matheus Vidal, pregador da Palavra" priority /><p>PALAVRA <span>→</span> PROPÓSITO</p></div></section>
    <section id="sobre" className="about-person"><div className="shell about-grid"><div><p className="eyebrow orange">SOBRE MATHEUS</p><h2>Uma trajetória de fé, serviço e compromisso com o Evangelho.</h2></div><div className="about-text"><p>Matheus Vidal é pregador da Palavra, ligado à Assembleia de Deus, e dedica seu ministério ao anúncio do Evangelho e à edificação da Igreja.</p><p>Em suas ministrações, une fidelidade bíblica, linguagem clara e sensibilidade espiritual para falar sobre fé, família, liderança cristã e propósito.</p><div className="author-stats"><div><b>12+</b><span>ANOS SERVINDO</span></div><div><b>80+</b><span>MINISTRAÇÕES E EVENTOS</span></div><div><b>30k</b><span>PESSOAS ALCANÇADAS</span></div></div></div></div></section>
    <section className="work-section shell"><div className="work-heading"><p className="eyebrow"><span /> LIVRO DE MATHEUS VIDAL</p><h2>Uma leitura para fortalecer a fé e viver o propósito de Deus.</h2></div><article className="book-card"><div className="book-cover"><small>UM LIVRO DE</small><b>MATHEUS<br />VIDAL</b><strong>FÉ</strong><span>que produz movimento</span></div><div><p className="eyebrow orange">CONHEÇA A OBRA</p><h3>Uma mensagem para a caminhada</h3><p>Conheça uma obra de reflexão bíblica, criada para aproximar o coração de Deus e levar a fé para as decisões de cada dia.</p><a className="text-link" href="/livro">Conhecer e comprar o livro <span>→</span></a></div></article></section>
    <section className="store-teaser"><div className="shell store-teaser-grid"><div className="store-teaser-photo"><Image src="/store/jesus-casal.png" fill sizes="(max-width: 850px) 100vw, 52vw" alt="Camisetas cristãs da coleção MV" /></div><div><p className="eyebrow gold">LOJA MV · MODA CRISTÃ</p><h2>Roupas cristãs para vestir fé e propósito.</h2><p>Conheça camisetas com estampas exclusivas, inspiradas em mensagens bíblicas e criadas para expressar aquilo em que você crê.</p><a className="primary" href="/loja">Entrar na loja <span>→</span></a></div></div></section>
    <section id="cursos" className="courses-bridge"><div className="shell bridge-grid"><div><p className="eyebrow orange">CURSOS DE MATHEUS VIDAL</p><h2>Aprofunde-se na Palavra e cresça em seu chamado.</h2><p>Acesse o site exclusivo da plataforma de estudos, escolha seu curso e acompanhe as aulas no seu ritmo.</p><a className="primary" href={platformUrl}>Abrir a plataforma de cursos <span>↗</span></a></div><div className="platform-preview"><div className="preview-top"><span /><span /><span /></div><p>PLATAFORMA MATHEUS VIDAL</p><h3>Aprenda no seu ritmo.</h3><div className="preview-progress"><span /></div><small>Conteúdo · Exercícios · Progresso</small></div></div></section>
    <WhatsAppContact />
    <SiteFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  </main>;
}
