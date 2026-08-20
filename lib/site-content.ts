import { list, put } from "@vercel/blob";

export type SiteStat = { value: string; label: string };

export type SiteContent = {
  hero: { eyebrow: string; title: string; description: string; image: string; caption: string };
  about: { eyebrow: string; title: string; firstParagraph: string; secondParagraph: string; stats: SiteStat[] };
  book: { eyebrow: string; title: string; description: string; coverImage: string };
  store: { eyebrow: string; title: string; description: string; image: string };
  school: { eyebrow: string; title: string; description: string };
};

export const defaultSiteContent: SiteContent = {
  hero: {
    eyebrow: "PREGADOR DA PALAVRA · AUTOR",
    title: "Uma vida dedicada à Palavra de Deus.",
    description: "Matheus Vidal é pregador da Palavra, ligado à Assembleia de Deus. Seu ministério anuncia o Evangelho com mensagens bíblicas que fortalecem a fé, edificam famílias e conduzem vidas ao propósito de Deus.",
    image: "/autor-principal.png",
    caption: "PALAVRA → PROPÓSITO",
  },
  about: {
    eyebrow: "SOBRE MATHEUS",
    title: "Uma trajetória de fé, serviço e compromisso com o Evangelho.",
    firstParagraph: "Matheus Vidal é pregador da Palavra, ligado à Assembleia de Deus, e dedica seu ministério ao anúncio do Evangelho e à edificação da Igreja.",
    secondParagraph: "Em suas ministrações, une fidelidade bíblica, linguagem clara e sensibilidade espiritual para falar sobre fé, família, liderança cristã e propósito.",
    stats: [{ value: "12+", label: "ANOS SERVINDO" }, { value: "80+", label: "MINISTRAÇÕES E EVENTOS" }, { value: "30k", label: "PESSOAS ALCANÇADAS" }],
  },
  book: {
    eyebrow: "LIVRO DE MATHEUS VIDAL",
    title: "Uma leitura para fortalecer a fé e viver o propósito de Deus.",
    description: "Conheça uma obra de reflexão bíblica, criada para aproximar o coração de Deus e levar a fé para as decisões de cada dia.",
    coverImage: "",
  },
  store: {
    eyebrow: "LOJA MV · MODA CRISTÃ",
    title: "Roupas cristãs para vestir fé e propósito.",
    description: "Conheça camisetas com estampas exclusivas, inspiradas em mensagens bíblicas e criadas para expressar aquilo em que você crê.",
    image: "/store/jesus-casal.png",
  },
  school: {
    eyebrow: "CURSOS DE MATHEUS VIDAL",
    title: "Aprofunde-se na Palavra e cresça em seu chamado.",
    description: "Acesse o site exclusivo da plataforma de estudos, escolha seu curso e acompanhe as aulas no seu ritmo.",
  },
};

const contentPath = "settings/site-content.v1.json";

function text(value: unknown, fallback: string) { return typeof value === "string" ? value : fallback; }

export function normalizeSiteContent(value: Partial<SiteContent> | undefined): SiteContent {
  const stats = Array.isArray(value?.about?.stats) ? value.about.stats.slice(0, 3).map((stat, index) => ({ value: text(stat?.value, defaultSiteContent.about.stats[index]?.value || ""), label: text(stat?.label, defaultSiteContent.about.stats[index]?.label || "") })) : defaultSiteContent.about.stats;
  return {
    hero: { eyebrow: text(value?.hero?.eyebrow, defaultSiteContent.hero.eyebrow), title: text(value?.hero?.title, defaultSiteContent.hero.title), description: text(value?.hero?.description, defaultSiteContent.hero.description), image: text(value?.hero?.image, defaultSiteContent.hero.image), caption: text(value?.hero?.caption, defaultSiteContent.hero.caption) },
    about: { eyebrow: text(value?.about?.eyebrow, defaultSiteContent.about.eyebrow), title: text(value?.about?.title, defaultSiteContent.about.title), firstParagraph: text(value?.about?.firstParagraph, defaultSiteContent.about.firstParagraph), secondParagraph: text(value?.about?.secondParagraph, defaultSiteContent.about.secondParagraph), stats },
    book: { eyebrow: text(value?.book?.eyebrow, defaultSiteContent.book.eyebrow), title: text(value?.book?.title, defaultSiteContent.book.title), description: text(value?.book?.description, defaultSiteContent.book.description), coverImage: text(value?.book?.coverImage, defaultSiteContent.book.coverImage) },
    store: { eyebrow: text(value?.store?.eyebrow, defaultSiteContent.store.eyebrow), title: text(value?.store?.title, defaultSiteContent.store.title), description: text(value?.store?.description, defaultSiteContent.store.description), image: text(value?.store?.image, defaultSiteContent.store.image) },
    school: { eyebrow: text(value?.school?.eyebrow, defaultSiteContent.school.eyebrow), title: text(value?.school?.title, defaultSiteContent.school.title), description: text(value?.school?.description, defaultSiteContent.school.description) },
  };
}

export async function readSiteContent(): Promise<SiteContent> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return defaultSiteContent;
  const { blobs } = await list({ prefix: contentPath, limit: 1 });
  if (!blobs[0]) return defaultSiteContent;
  const response = await fetch(blobs[0].url, { cache: "no-store" });
  if (!response.ok) return defaultSiteContent;
  return normalizeSiteContent(await response.json() as Partial<SiteContent>);
}

export async function writeSiteContent(content: SiteContent) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Conecte o Vercel Blob para salvar o conteúdo.");
  await put(contentPath, JSON.stringify(content), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
}
