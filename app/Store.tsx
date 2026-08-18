"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Product = { id: number; name: string; message: string; price: number; image: string; tone: "Preto" | "Claro"; badge?: string };
type CartItem = Product & { size: string; qty: number };

const products: Product[] = [
  { id: 1, name: "Jesus — O nome sobre todo nome", message: "Jesus no centro de tudo · Filipenses 2:9-11", price: 99.9, image: "/store/jesus-casal.png", tone: "Preto", badge: "Destaque" },
  { id: 2, name: "Coroa de Espinhos", message: "Ele foi ferido por nossas transgressões · Isaías 53:5", price: 94.9, image: "/store/colecao-preta.png", tone: "Preto", badge: "Coleção" },
  { id: 3, name: "Jesus — Filipenses 2:9", message: "O nome que está sobre todo nome", price: 94.9, image: "/store/jesus-cruz.png", tone: "Preto" },
  { id: 4, name: "Negue-se — Lucas 9:23", message: "Tome cada dia a sua cruz e siga-me", price: 94.9, image: "/store/negue-se.png", tone: "Preto", badge: "Nova" },
  { id: 5, name: "MVLA Essencial Bege", message: "Família, fé e propósito", price: 99.9, image: "/store/mvla-bege.png", tone: "Claro" },
];

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Store() {
  const [filter, setFilter] = useState("Todos");
  const [chosen, setChosen] = useState<Product | null>(null);
  const [size, setSize] = useState("M");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const visible = useMemo(() => filter === "Todos" ? products : products.filter(p => p.tone === filter), [filter]);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function select(product: Product) { setChosen(product); setSize("M"); }
  function add() {
    if (!chosen) return;
    setCart(current => {
      const found = current.find(i => i.id === chosen.id && i.size === size);
      return found ? current.map(i => i === found ? { ...i, qty: i.qty + 1 } : i) : [...current, { ...chosen, size, qty: 1 }];
    });
    setChosen(null);
    setOpen(true);
  }

  return <section className="store store-page">
    <div className="store-intro shell"><p className="eyebrow gold">MATHEUS VIDAL · LAIS · ANTONELLA</p><div><h1>Loja MVLA de camisetas cristãs.</h1><p>Moda cristã para vestir fé, família e propósito. Conheça peças com tecidos confortáveis e estampas bíblicas exclusivas.</p></div></div>
    <div className="store-benefits shell"><span>◇ <b>Tecidos premium</b><small>Conforto para todos os dias</small></span><span>♧ <b>Estampas exclusivas</b><small>Mensagens que transformam</small></span><span>♡ <b>Fé e propósito</b><small>Identidade em cada detalhe</small></span><span>＋ <b>Compra demonstrativa</b><small>Experimente o fluxo completo</small></span></div>
    <div className="store-catalog shell"><header><div><p className="eyebrow gold">COLEÇÃO CRISTÃ MVLA</p><h2>Escolha a mensagem que você quer vestir.</h2></div><div className="store-filters">{["Todos", "Preto", "Claro"].map(f => <button className={filter === f ? "active" : ""} onClick={() => setFilter(f)} key={f}>{f}</button>)}<button className="cart-button" onClick={() => setOpen(true)}>Sacola <b>{cart.reduce((n, i) => n + i.qty, 0)}</b></button></div></header>
      <div className="product-grid">{visible.map(product => <article className="product-card" key={product.id}>{product.badge && <span className="product-badge">{product.badge}</span>}<button className="product-photo" onClick={() => select(product)} aria-label={`Ver ${product.name}`}><Image src={product.image} fill sizes="(max-width: 560px) 100vw, (max-width: 850px) 50vw, 33vw" alt={`Camiseta cristã ${product.name}`} /></button><div><small>CAMISETA · ALGODÃO PREMIUM</small><h3>{product.name}</h3><p>{money(product.price)} <span>ou 3x sem juros</span></p><button onClick={() => select(product)}>Ver produto e tamanhos →</button></div></article>)}</div>
    </div>
    {chosen && <div className="modal-backdrop" onMouseDown={() => setChosen(null)}><div className="product-modal" onMouseDown={e => e.stopPropagation()}><button className="close" onClick={() => setChosen(null)} aria-label="Fechar">×</button><div className="modal-product-photo"><Image src={chosen.image} fill sizes="(max-width: 850px) 100vw, 50vw" alt={`Detalhes da camiseta ${chosen.name}`} /></div><div><p className="eyebrow gold">CAMISETA MVLA · EDIÇÃO ESPECIAL</p><h2>{chosen.name}</h2><strong>{money(chosen.price)}</strong><p>{chosen.message}. Malha confortável e estampa exclusiva para expressar sua fé.</p><label>Tamanho<div className="size-picker">{["P", "M", "G", "GG"].map(s => <button className={size === s ? "active" : ""} onClick={() => setSize(s)} key={s}>{s}</button>)}</div></label><button className="store-primary" onClick={add}>Adicionar à sacola</button></div></div></div>}
    {open && <div className="cart-overlay" onMouseDown={() => setOpen(false)}><aside className="cart-drawer" onMouseDown={e => e.stopPropagation()}><header><div><small>SUA SACOLA</small><h2>{cart.length ? `${cart.reduce((n, i) => n + i.qty, 0)} peça(s)` : "Está vazia"}</h2></div><button onClick={() => setOpen(false)} aria-label="Fechar sacola">×</button></header>{success ? <div className="cart-success"><span>✓</span><h3>Pedido simulado com sucesso!</h3><p>Nenhuma cobrança foi realizada. A experiência já está pronta para receber um meio de pagamento real.</p><button onClick={() => { setSuccess(false); setCart([]); setOpen(false); }}>Concluir</button></div> : <><div className="cart-items">{cart.map((item, index) => <article key={`${item.id}-${item.size}`}><div className="cart-thumb"><Image src={item.image} fill sizes="75px" alt="" /></div><div><b>{item.name}</b><small>Tamanho {item.size}</small><span>{money(item.price)} · Qtd. {item.qty}</span></div><button onClick={() => setCart(cart.filter((_, i) => i !== index))}>Remover</button></article>)}</div><footer className="cart-total"><span>Subtotal <b>{money(total)}</b></span><small>Frete calculado na próxima etapa.</small><button disabled={!cart.length} onClick={() => setSuccess(true)}>Finalizar compra simulada</button></footer></>}</aside></div>}
  </section>;
}
