"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useStoreCart } from "./StoreCart";
import { StoreProduct, defaultProducts } from "./store-data";

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Store() {
  const cart = useStoreCart();
  const setCartOpen = cart.setOpen;
  const [products, setProducts] = useState<StoreProduct[]>(defaultProducts);
  const [filter, setFilter] = useState("Todos");
  const [chosen, setChosen] = useState<StoreProduct | null>(null);
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [previewColors, setPreviewColors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetch("/api/products").then(response => response.json()).then(setProducts).catch(() => {}); }, []);
  useEffect(() => { if (new URLSearchParams(window.location.search).get("cart") === "1") setCartOpen(true); }, [setCartOpen]);

  const visible = useMemo(() => products.filter(product => {
    if (filter === "Todos") return true;
    if (filter === "Preto") return product.colors.some(item => item.name === "Preto");
    return product.colors.some(item => item.name !== "Preto");
  }), [filter, products]);
  const currentColor = chosen?.colors.find(item => item.name === color) || chosen?.colors[0];

  function select(product: StoreProduct, initialColor?: string) {
    setChosen(product);
    setSize(product.sizes.includes("M") ? "M" : product.sizes[0]);
    setColor(initialColor || product.colors[0]?.name || "");
    setQuantity(1);
  }
  function add() {
    if (!chosen || !currentColor) return;
    cart.add({ productId: chosen.id, name: chosen.name, price: chosen.price, image: currentColor.image, color: currentColor.name, size }, quantity);
    setChosen(null);
  }

  return <section className="store store-page">
    <div className="store-intro shell"><p className="eyebrow gold">MATHEUS VIDAL · LAIS · ANTONELLA</p><div><h1>Loja MVLA de camisetas cristãs.</h1><p>Moda cristã com acabamento premium, peças para diferentes estilos e uma mensagem que permanece muito além da roupa.</p></div></div>
    <div className="store-benefits shell"><span>◇ <b>Tecidos premium</b><small>Conforto para todos os dias</small></span><span>♧ <b>Estampas exclusivas</b><small>Mensagens que transformam</small></span><span>♡ <b>Escolha sua cor</b><small>Veja a peça antes de comprar</small></span><span>＋ <b>Sacola inteligente</b><small>Quantidade e variações salvas</small></span></div>
    <div className="store-catalog shell"><header><div><p className="eyebrow gold">COLEÇÃO CRISTÃ MVLA</p><h2>Escolha a mensagem que você quer vestir.</h2></div><div className="store-filters">{["Todos", "Preto", "Claros"].map(item => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}<button className="cart-button" onClick={() => cart.setOpen(true)}>Sacola <b>{cart.count}</b></button></div></header>
      <div className="product-grid">{visible.map(product => {
        const preview = product.colors.find(item => item.name === previewColors[product.id]) || product.colors[0];
        return <article className="product-card" key={product.id}>{product.badge && <span className="product-badge">{product.badge}</span>}<button className="product-photo" onClick={() => select(product, preview?.name)} aria-label={`Ver ${product.name}`}><Image src={preview?.image || "/store/jesus-casal.png"} fill sizes="(max-width: 560px) 100vw, (max-width: 850px) 50vw, 33vw" alt={`Camiseta cristã ${product.name} na cor ${preview?.name}`} /></button><div><small>{product.category.toUpperCase()} · ALGODÃO PREMIUM</small><h3>{product.name}</h3><div className="card-swatches" aria-label="Cores disponíveis">{product.colors.map(item => <button key={item.name} className={preview?.name === item.name ? "active" : ""} style={{ "--swatch": item.hex } as React.CSSProperties} onClick={() => setPreviewColors(current => ({ ...current, [product.id]: item.name }))} aria-label={`Mostrar cor ${item.name}`} title={item.name} />)}<span>{product.colors.length} {product.colors.length === 1 ? "cor" : "cores"}</span></div><p>{money(product.price)} <span>ou 3x sem juros</span></p><button onClick={() => select(product, preview?.name)}>Ver produto e opções →</button></div></article>;
      })}</div>
    </div>

    {chosen && currentColor && <div className="modal-backdrop"><div className="product-modal" role="dialog" aria-modal="true" aria-label="Opções do produto"><button className="close" onClick={() => setChosen(null)} aria-label="Fechar">×</button><div className="modal-product-photo"><Image src={currentColor.image} fill sizes="(max-width: 850px) 100vw, 55vw" alt={`${chosen.name} na cor ${currentColor.name}`} /></div><div className="product-options"><p className="eyebrow gold">CAMISETA MVLA · EDIÇÃO ESPECIAL</p><h2>{chosen.name}</h2><strong>{money(chosen.price)}</strong><p>{chosen.message}. Malha confortável e estampa exclusiva para expressar sua fé.</p><fieldset className="color-picker"><legend>Cor: <b>{currentColor.name}</b></legend><div>{chosen.colors.map(item => <button key={item.name} className={color === item.name ? "active" : ""} onClick={() => setColor(item.name)} aria-label={`Selecionar cor ${item.name}`}><span style={{ background: item.hex }} /><small>{item.name}</small></button>)}</div></fieldset><fieldset><legend>Tamanho: <b>{size}</b></legend><div className="size-picker">{chosen.sizes.map(item => <button className={size === item ? "active" : ""} onClick={() => setSize(item)} key={item}>{item}</button>)}</div></fieldset><div className="purchase-controls"><label>Quantidade<div className="quantity-picker"><button onClick={() => setQuantity(value => Math.max(1, value - 1))} aria-label="Diminuir quantidade">−</button><output>{quantity}</output><button onClick={() => setQuantity(value => Math.min(20, value + 1))} aria-label="Aumentar quantidade">＋</button></div></label><div><small>Total</small><strong>{money(chosen.price * quantity)}</strong></div></div><button className="store-primary" onClick={add}>Adicionar {quantity} {quantity === 1 ? "peça" : "peças"} à sacola</button></div></div></div>}

    {cart.open && <div className="cart-overlay"><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Sacola de compras"><header><div><small>SUA SACOLA</small><h2>{cart.count ? `${cart.count} ${cart.count === 1 ? "peça" : "peças"}` : "Está vazia"}</h2></div><button onClick={() => cart.setOpen(false)} aria-label="Fechar sacola">×</button></header>{success ? <div className="cart-success"><span>✓</span><h3>Pedido simulado com sucesso!</h3><p>Nenhuma cobrança foi realizada. A experiência já está pronta para receber um pagamento real.</p><button onClick={() => { setSuccess(false); cart.clear(); cart.setOpen(false); }}>Concluir</button></div> : <>{cart.items.length ? <div className="cart-items">{cart.items.map(item => <article key={item.key}><div className="cart-thumb"><Image src={item.image} fill sizes="80px" alt={`${item.name} ${item.color}`} /></div><div><b>{item.name}</b><small>{item.color} · Tamanho {item.size}</small><span>{money(item.price)}</span><div className="cart-quantity"><button onClick={() => cart.updateQuantity(item.key, item.qty - 1)} aria-label={`Diminuir ${item.name}`}>−</button><output>{item.qty}</output><button onClick={() => cart.updateQuantity(item.key, item.qty + 1)} aria-label={`Aumentar ${item.name}`}>＋</button></div></div><button onClick={() => cart.remove(item.key)}>Remover</button></article>)}</div> : <div className="empty-cart"><span>▱</span><h3>Sua sacola está esperando.</h3><p>Escolha uma peça, uma cor e o tamanho ideal.</p><button onClick={() => cart.setOpen(false)}>Continuar comprando</button></div>}<footer className="cart-total"><span>Subtotal <b>{money(cart.total)}</b></span><small>Frete calculado na próxima etapa.</small><button disabled={!cart.items.length} onClick={() => setSuccess(true)}>Finalizar compra simulada</button></footer></>}</aside></div>}
  </section>;
}
