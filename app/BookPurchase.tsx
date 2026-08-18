"use client";

import { FormEvent, useEffect, useState } from "react";

type Settings = { bookTitle: string; bookPrice: string; purchaseUrl: string };
const initial: Settings = { bookTitle: "Livro de Matheus Vidal", bookPrice: "49,90", purchaseUrl: "" };

export default function BookPurchase() {
  const [data, setData] = useState(initial);
  const [checkout, setCheckout] = useState(false);
  const [complete, setComplete] = useState(false);
  useEffect(() => { fetch("/api/settings").then(r => r.json()).then(setData).catch(() => {}); }, []);
  function finish(e: FormEvent) { e.preventDefault(); setComplete(true); }
  function buy() {
    if (data.purchaseUrl) window.open(data.purchaseUrl, "_blank", "noopener,noreferrer");
    else { setComplete(false); setCheckout(true); }
  }
  return <>
    <section className="book-sales-section shell">
      <div className="book-cover book-cover-large"><small>UM LIVRO DE</small><b>MATHEUS<br />VIDAL</b><strong>FÉ</strong><span>que produz movimento</span></div>
      <div className="book-sales-copy"><p className="eyebrow orange">LIVRO EM DESTAQUE</p><h2>Uma leitura para transformar fé em movimento.</h2><p>Reflexões bíblicas e caminhos práticos para viver com propósito, tomar decisões com clareza e fortalecer sua caminhada com Deus.</p><ul><li>Leitura clara e aplicável</li><li>Reflexões para a vida cotidiana</li><li>Uma obra de Matheus Vidal</li></ul><div className="book-price"><small>A partir de</small><strong>R$ {data.bookPrice}</strong></div><button className="primary" onClick={buy}>Comprar o livro <span>→</span></button></div>
    </section>
    {checkout && <div className="modal-backdrop"><div className="checkout-modal" role="dialog" aria-modal="true" aria-label="Finalizar compra do livro"><button className="close" onClick={() => setCheckout(false)} aria-label="Fechar">×</button>{complete ? <div className="checkout-success"><span>✓</span><h2>Pedido simulado com sucesso!</h2><p>Nenhuma cobrança foi realizada. O checkout já demonstra a experiência de compra que será conectada ao pagamento.</p><button className="primary" onClick={() => setCheckout(false)}>Concluir</button></div> : <><p className="eyebrow orange">COMPRA SEGURA · SIMULAÇÃO</p><h2>{data.bookTitle}</h2><div className="checkout-product"><span>Livro físico</span><strong>R$ {data.bookPrice}</strong></div><form onSubmit={finish}><label>Nome completo<input required placeholder="Seu nome" /></label><label>E-mail<input required type="email" placeholder="voce@email.com" /></label><label>CEP<input required inputMode="numeric" placeholder="00000-000" /></label><button className="primary" type="submit">Finalizar compra simulada <span>→</span></button></form><small>Nenhuma cobrança será realizada nesta demonstração.</small></>}</div></div>}
  </>;
}
