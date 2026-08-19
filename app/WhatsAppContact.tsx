"use client";

import { useEffect, useState } from "react";

const defaultNumber = "5527988792894";

function normalizeBrazilianNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits || defaultNumber;
}

export default function WhatsAppContact() {
  const [number, setNumber] = useState(defaultNumber);
  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => setNumber(normalizeBrazilianNumber(data.whatsapp))).catch(() => {});
  }, []);
  const message = encodeURIComponent("Olá! Conheci o ministério de Matheus Vidal pelo site e gostaria de informações para convidá-lo a ministrar em nossa igreja ou evento.");
  const url = `https://wa.me/${normalizeBrazilianNumber(number)}?text=${message}`;
  return <>
    <section id="contato" className="whatsapp-section shell">
      <div><p className="eyebrow"><span /> AGENDA E CONVITES</p><h2>Convide Matheus Vidal para ministrar em sua <em>igreja ou evento.</em></h2><p>Pregações, congressos, cultos e encontros cristãos. Consulte a agenda e a disponibilidade diretamente pelo WhatsApp.</p></div>
      <a className="whatsapp-card" href={url} target="_blank" rel="noreferrer">
        <span className="wa-icon" aria-hidden="true">◔</span><div><small>ATENDIMENTO DIRETO</small><b>Conversar no WhatsApp</b><p>A conversa já abre com uma mensagem pronta</p></div><span>↗</span>
      </a>
    </section>
    <a className="floating-whatsapp" href={url} target="_blank" rel="noreferrer" aria-label="Falar com Matheus Vidal no WhatsApp"><span>◔</span><small>Fale comigo</small></a>
  </>;
}
