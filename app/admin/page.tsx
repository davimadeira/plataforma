"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AdminProductEditor from "./AdminProductEditor";
import { StoreProduct, defaultProducts } from "../store-data";

type Settings = { whatsapp: string; bookTitle: string; bookPrice: string; purchaseUrl: string };

export default function Admin() {
  const [data, setData] = useState<Settings>({ whatsapp: "5527988792894", bookTitle: "Livro de Matheus Vidal", bookPrice: "49,90", purchaseUrl: "" });
  const [products, setProducts] = useState<StoreProduct[]>(defaultProducts);
  const [pin, setPin] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [tab, setTab] = useState<"geral" | "produtos">("geral");
  const [status, setStatus] = useState("");
  useEffect(() => {
    Promise.all([fetch("/api/settings").then(response => response.json()), fetch("/api/products").then(response => response.json())]).then(([settings, storeProducts]) => { setData(settings); setProducts(storeProducts); }).catch(() => {});
  }, []);
  async function login() {
    setStatus("Verificando acesso...");
    const response = await fetch("/api/admin-auth", { method: "POST", headers: { "x-admin-pin": pin } });
    if (response.ok) { setAllowed(true); setStatus(""); }
    else setStatus("PIN incorreto.");
  }
  async function saveGeneral() {
    setStatus("Salvando contato e livro...");
    const response = await fetch("/api/settings", { method: "PUT", headers: { "content-type": "application/json", "x-admin-pin": pin }, body: JSON.stringify(data) });
    const result = await response.json().catch(() => ({}));
    setStatus(response.ok ? "Contato e livro publicados com sucesso." : result.error || "Não foi possível salvar.");
  }
  async function saveProducts() {
    setStatus("Publicando catálogo...");
    const response = await fetch("/api/products", { method: "PUT", headers: { "content-type": "application/json", "x-admin-pin": pin }, body: JSON.stringify(products) });
    const result = await response.json().catch(() => ({}));
    setStatus(response.ok ? "Produtos publicados na loja." : result.error || "Não foi possível salvar os produtos.");
  }

  return <main className="site-admin-page">{!allowed ? <section className="admin-login"><Image src="/logo-mvla-redrawn.png" width={94} height={94} alt="Marca MVLA" priority /><p>ÁREA RESTRITA</p><h1>Painel administrativo</h1><span>Gerencie o site, o livro e todos os produtos da loja.</span><input type="password" value={pin} onChange={event => setPin(event.target.value)} onKeyDown={event => event.key === "Enter" && login()} placeholder="Digite o PIN" /><button className="primary" onClick={login}>Entrar no painel</button>{status && <small>{status}</small>}</section> : <div className="admin-shell"><aside className="site-admin-sidebar"><Link href="/" className="admin-sidebar-brand"><Image src="/logo-mvla-redrawn.png" width={66} height={66} alt="Marca MVLA" /><span><b>MVLA</b><small>ADMINISTRAÇÃO</small></span></Link><nav><button className={tab === "geral" ? "active" : ""} onClick={() => setTab("geral")}><span>01</span> Contato e livro</button><button className={tab === "produtos" ? "active" : ""} onClick={() => setTab("produtos")}><span>02</span> Produtos da loja</button></nav><div><Link href="/" target="_blank">Ver site ↗</Link><Link href="/loja" target="_blank">Ver loja ↗</Link><button onClick={() => setAllowed(false)}>Sair</button></div></aside><section className="admin-content"><header className="admin-topbar"><div><p>MATHEUS VIDAL · PAINEL ADMIN</p><h1>{tab === "geral" ? "Contato e livro" : "Catálogo da loja"}</h1></div><button className="save-button" onClick={tab === "geral" ? saveGeneral : saveProducts}>{tab === "geral" ? "Salvar informações" : "Salvar produtos"}</button></header>{status && <div className="admin-status" role="status">{status}</div>}{tab === "geral" ? <section className="admin-general"><div className="admin-section-title"><small>CONFIGURAÇÕES DO SITE</small><h2>Informações públicas</h2><p>O visitante verá esses dados nas páginas do site e do livro.</p></div><div className="admin-form professional"><label className="wide">WhatsApp com DDI e DDD<input value={data.whatsapp} onChange={event => setData({ ...data, whatsapp: event.target.value })} placeholder="5527999999999" /><small>Recebe os pedidos de agenda e convites.</small></label><label>Nome do livro<input value={data.bookTitle} onChange={event => setData({ ...data, bookTitle: event.target.value })} /></label><label>Preço do livro<input value={data.bookPrice} onChange={event => setData({ ...data, bookPrice: event.target.value })} /></label><label className="wide">Link de pagamento<input value={data.purchaseUrl} onChange={event => setData({ ...data, purchaseUrl: event.target.value })} placeholder="Opcional — deixe vazio para usar a simulação" /></label></div></section> : <AdminProductEditor products={products} setProducts={setProducts} pin={pin} onStatus={setStatus} />}</section></div>}</main>;
}
