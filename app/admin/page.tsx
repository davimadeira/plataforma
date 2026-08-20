"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import AdminProductEditor from "./AdminProductEditor";
import { StoreProduct, defaultProducts } from "../store-data";
import { defaultSiteContent, SiteContent } from "../../lib/site-content";

type Settings = { whatsapp: string; bookTitle: string; bookPrice: string; purchaseUrl: string };
type AdminTab = "site" | "book" | "products" | "school";
type ImageTarget = "hero" | "book" | "store";

const initialSettings: Settings = { whatsapp: "5527988792894", bookTitle: "Livro de Matheus Vidal", bookPrice: "49,90", purchaseUrl: "" };
const platformAdminUrl = "https://cursos-matheus-vidal.vercel.app/admin";

function UploadProgress({ value }: { value?: number }) {
  if (value === undefined) return null;
  return <small className="admin-image-progress">{value < 100 ? `Enviando imagem: ${value}%` : "Imagem enviada — salve para publicar."}</small>;
}

export default function Admin() {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [products, setProducts] = useState<StoreProduct[]>(defaultProducts);
  const [pin, setPin] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [tab, setTab] = useState<AdminTab>("site");
  const [status, setStatus] = useState("");
  const [uploads, setUploads] = useState<Partial<Record<ImageTarget, number>>>({});

  useEffect(() => {
    Promise.all([fetch("/api/settings").then(response => response.json()), fetch("/api/products").then(response => response.json()), fetch("/api/site-content").then(response => response.json())]).then(([siteSettings, storeProducts, siteContent]) => {
      setSettings({ ...initialSettings, ...siteSettings });
      setProducts(Array.isArray(storeProducts) ? storeProducts : defaultProducts);
      if (siteContent?.hero) setContent(siteContent as SiteContent);
    }).catch(() => {});
  }, []);

  async function login() {
    setStatus("Verificando acesso...");
    const response = await fetch("/api/admin-auth", { method: "POST", headers: { "x-admin-pin": pin } });
    if (response.ok) { setAllowed(true); setStatus(""); }
    else setStatus("Senha incorreta.");
  }
  async function saveSite() {
    setStatus("Publicando as informações do site...");
    const response = await fetch("/api/site-content", { method: "PUT", headers: { "content-type": "application/json", "x-admin-pin": pin }, body: JSON.stringify(content) });
    const result = await response.json().catch(() => ({}));
    setStatus(response.ok ? "Site institucional publicado com sucesso." : result.error || "Não foi possível salvar.");
  }
  async function saveBook() {
    setStatus("Publicando livro e contato...");
    const [settingsResponse, contentResponse] = await Promise.all([
      fetch("/api/settings", { method: "PUT", headers: { "content-type": "application/json", "x-admin-pin": pin }, body: JSON.stringify(settings) }),
      fetch("/api/site-content", { method: "PUT", headers: { "content-type": "application/json", "x-admin-pin": pin }, body: JSON.stringify(content) }),
    ]);
    const failed = !settingsResponse.ok ? await settingsResponse.json().catch(() => ({})) : !contentResponse.ok ? await contentResponse.json().catch(() => ({})) : null;
    setStatus(failed ? failed.error || "Não foi possível salvar." : "Livro, contato e capa publicados com sucesso.");
  }
  async function saveProducts() {
    setStatus("Publicando catálogo...");
    const response = await fetch("/api/products", { method: "PUT", headers: { "content-type": "application/json", "x-admin-pin": pin }, body: JSON.stringify(products) });
    const result = await response.json().catch(() => ({}));
    setStatus(response.ok ? "Produtos publicados na loja." : result.error || "Não foi possível salvar os produtos.");
  }
  function updateImage(target: ImageTarget, image: string) {
    setContent(current => target === "hero" ? { ...current, hero: { ...current.hero, image } } : target === "book" ? { ...current, book: { ...current.book, coverImage: image } } : { ...current, store: { ...current.store, image } });
  }
  function previewPublishedSite() {
    window.open(`/?atualizado=${Date.now()}`, "_blank", "noopener,noreferrer");
  }
  async function uploadImage(target: ImageTarget, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploads(current => ({ ...current, [target]: 0 }));
    setStatus("Enviando imagem...");
    try {
      const blob = await upload(`site/${target}/${file.name}`, file, { access: "public", handleUploadUrl: "/api/site-media", clientPayload: JSON.stringify({ pin }), onUploadProgress: uploadEvent => setUploads(current => ({ ...current, [target]: Math.round(uploadEvent.percentage) })) });
      updateImage(target, blob.url);
      setUploads(current => ({ ...current, [target]: 100 }));
      setStatus("Imagem enviada. Salve esta seção para publicar.");
    } catch (error) {
      setUploads(current => ({ ...current, [target]: undefined }));
      setStatus(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    }
  }
  const topTitle = { site: "Site e biografia", book: "Livro e contato", products: "Catálogo da loja", school: "Gestão da escola" }[tab];
  const saveAction = tab === "site" ? saveSite : tab === "book" ? saveBook : tab === "products" ? saveProducts : undefined;

  return <main className="site-admin-page">
    {!allowed ? <section className="admin-login"><Image src="/logo-mv-contrast.png" width={94} height={94} alt="Marca MV" priority /><p>ÁREA RESTRITA</p><h1>Central de administração</h1><span>Edite o site, a loja, os livros e a escola em um único lugar.</span><input type="password" value={pin} onChange={event => setPin(event.target.value)} onKeyDown={event => event.key === "Enter" && void login()} placeholder="Digite a senha administrativa" /><button className="primary" onClick={() => void login()}>Entrar no painel</button>{status && <small>{status}</small>}</section> : <div className="admin-shell">
      <aside className="site-admin-sidebar"><Link href="/" className="admin-sidebar-brand"><Image src="/logo-mv-contrast.png" width={66} height={66} alt="Marca MV" /><span><b>MV</b><small>ADMINISTRAÇÃO</small></span></Link><nav><button className={tab === "site" ? "active" : ""} onClick={() => setTab("site")}><span>01</span> Site e biografia</button><button className={tab === "book" ? "active" : ""} onClick={() => setTab("book")}><span>02</span> Livro e contato</button><button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}><span>03</span> Produtos da loja</button><button className={tab === "school" ? "active" : ""} onClick={() => setTab("school")}><span>04</span> Escola e cursos</button></nav><div><Link href="/" target="_blank">Ver site ↗</Link><Link href="/loja" target="_blank">Ver loja ↗</Link><a href={platformAdminUrl} target="_blank" rel="noreferrer">Abrir escola ↗</a><button onClick={() => setAllowed(false)}>Sair</button></div></aside>
      <section className="admin-content"><header className="admin-topbar"><div><p>CENTRAL MV · PAINEL ADMIN</p><h1>{topTitle}</h1></div><div className="admin-topbar-actions"><button className="admin-preview-button" onClick={previewPublishedSite}>Ver site atualizado ↗</button>{saveAction && <button className="save-button" onClick={() => void saveAction()}>{tab === "products" ? "Salvar produtos" : "Salvar e publicar"}</button>}</div></header>{status && <div className="admin-status" role="status">{status}</div>}

        {tab === "site" && <section className="admin-general admin-content-editor"><div className="admin-section-title"><div><small>CONTEÚDO DO SITE</small><h2>Matheus Vidal e sua história</h2></div><p>Edite os textos, números e foto que aparecem na página inicial. As alterações só entram no ar depois de salvar.</p></div><div className="admin-form professional"><label>Chamada acima do título<input value={content.hero.eyebrow} onChange={event => setContent(current => ({ ...current, hero: { ...current.hero, eyebrow: event.target.value } }))} /></label><label>Frase principal do site (H1)<input value={content.hero.title} onChange={event => setContent(current => ({ ...current, hero: { ...current.hero, title: event.target.value } }))} /></label><label className="wide">Apresentação de Matheus<textarea value={content.hero.description} onChange={event => setContent(current => ({ ...current, hero: { ...current.hero, description: event.target.value } }))} /></label><label>Foto principal — endereço da imagem<input value={content.hero.image} onChange={event => updateImage("hero", event.target.value)} /></label><label>Texto ao lado da foto<input value={content.hero.caption} onChange={event => setContent(current => ({ ...current, hero: { ...current.hero, caption: event.target.value } }))} /></label><label className="wide admin-image-upload">Enviar nova foto principal<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => void uploadImage("hero", event)} /><UploadProgress value={uploads.hero} /></label><div className="admin-image-preview wide"><Image src={content.hero.image} width={840} height={460} sizes="(max-width: 760px) 100vw, 840px" alt="Prévia da foto principal" unoptimized /></div><label>Nome da seção de biografia<input value={content.about.eyebrow} onChange={event => setContent(current => ({ ...current, about: { ...current.about, eyebrow: event.target.value } }))} /></label><label>Título da biografia<input value={content.about.title} onChange={event => setContent(current => ({ ...current, about: { ...current.about, title: event.target.value } }))} /></label><label className="wide">Primeiro parágrafo da biografia<textarea value={content.about.firstParagraph} onChange={event => setContent(current => ({ ...current, about: { ...current.about, firstParagraph: event.target.value } }))} /></label><label className="wide">Segundo parágrafo da biografia<textarea value={content.about.secondParagraph} onChange={event => setContent(current => ({ ...current, about: { ...current.about, secondParagraph: event.target.value } }))} /></label>{content.about.stats.map((stat, index) => <div className="admin-stat-input" key={index}><label>Número<input value={stat.value} onChange={event => setContent(current => ({ ...current, about: { ...current.about, stats: current.about.stats.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item) } }))} /></label><label>Descrição<input value={stat.label} onChange={event => setContent(current => ({ ...current, about: { ...current.about, stats: current.about.stats.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) } }))} /></label></div>)}</div></section>}

        {tab === "book" && <section className="admin-general admin-content-editor"><div className="admin-section-title"><div><small>LIVRO E AGENDA</small><h2>Obra, capa e contato</h2></div><p>Configure o livro, sua capa e o número que recebe os pedidos de agenda no WhatsApp.</p></div><div className="admin-form professional"><label>WhatsApp com DDI e DDD<input value={settings.whatsapp} onChange={event => setSettings(current => ({ ...current, whatsapp: event.target.value }))} placeholder="5527999999999" /><small>Recebe os pedidos de agenda e convites.</small></label><label>Nome do livro<input value={settings.bookTitle} onChange={event => setSettings(current => ({ ...current, bookTitle: event.target.value }))} /></label><label>Preço do livro<input value={settings.bookPrice} onChange={event => setSettings(current => ({ ...current, bookPrice: event.target.value }))} /></label><label className="wide">Link de pagamento<input value={settings.purchaseUrl} onChange={event => setSettings(current => ({ ...current, purchaseUrl: event.target.value }))} placeholder="Opcional — deixe vazio para usar a simulação" /></label><label>Chamada da seção do livro<input value={content.book.eyebrow} onChange={event => setContent(current => ({ ...current, book: { ...current.book, eyebrow: event.target.value } }))} /></label><label>Título de apresentação do livro<input value={content.book.title} onChange={event => setContent(current => ({ ...current, book: { ...current.book, title: event.target.value } }))} /></label><label className="wide">Descrição do livro<textarea value={content.book.description} onChange={event => setContent(current => ({ ...current, book: { ...current.book, description: event.target.value } }))} /></label><label className="wide">Capa do livro — endereço da imagem<input value={content.book.coverImage} onChange={event => updateImage("book", event.target.value)} placeholder="Envie uma imagem abaixo ou cole o endereço" /></label><label className="wide admin-image-upload">Enviar capa do livro<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => void uploadImage("book", event)} /><UploadProgress value={uploads.book} /></label>{content.book.coverImage && <div className="admin-book-preview wide"><Image src={content.book.coverImage} width={360} height={500} sizes="360px" alt="Prévia da capa do livro" unoptimized /></div>}</div></section>}

        {tab === "products" && <AdminProductEditor products={products} setProducts={setProducts} pin={pin} onStatus={setStatus} />}

        {tab === "school" && <section className="admin-general central-school"><div className="admin-section-title"><div><small>ESCOLA ONLINE</small><h2>Cursos, aulas, provas e matrículas</h2></div><p>Esta é a administração completa da escola dentro da Central MV. Aqui você edita cursos, envia vídeos, cria provas, configura Pix e libera alunos.</p></div><div className="central-school-actions"><a className="save-button" href={platformAdminUrl} target="_blank" rel="noreferrer">Abrir em tela cheia ↗</a><small>Use a senha da escola que você já configurou para acessar esta área.</small></div><iframe className="central-school-frame" src={platformAdminUrl} title="Administração da Escola Online Matheus Vidal" /></section>}
      </section>
    </div>}
  </main>;
}
