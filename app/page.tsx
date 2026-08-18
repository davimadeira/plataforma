"use client";

import { FormEvent, useState } from "react";

const modules = [
  { n: "01", title: "O ponto de partida", meta: "4 aulas · 32 min", open: true },
  { n: "02", title: "Clareza e direção", meta: "6 aulas · 54 min", open: false },
  { n: "03", title: "Hábitos que permanecem", meta: "5 aulas · 47 min", open: false },
  { n: "04", title: "O plano em movimento", meta: "7 aulas · 1h 12 min", open: false },
];

export default function Home() {
  const [page, setPage] = useState<"inicio" | "curso" | "area">("inicio");
  const [checkout, setCheckout] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [notice, setNotice] = useState("");
  function go(next: "inicio" | "curso" | "area") { setPage(next); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function submitContact(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setNotice("Mensagem preparada! Em breve entraremos em contato para combinar os detalhes."); event.currentTarget.reset(); }

  return <main>
    <header className="nav shell">
      <button className="brand" onClick={() => go("inicio")} aria-label="Ir para o início"><span className="brand-mark">A</span><span>ACENDA</span></button>
      <nav aria-label="Navegação principal"><button onClick={() => go("inicio")} className={page === "inicio" ? "active" : ""}>Início</button><button onClick={() => go("curso")} className={page === "curso" ? "active" : ""}>Curso</button><button onClick={() => { go("inicio"); setTimeout(() => document.querySelector("#autor")?.scrollIntoView({ behavior: "smooth" }), 50); }}>Sobre o autor</button></nav>
      <button className="login" onClick={() => go("area")}>Minha área <span>↗</span></button>
    </header>

    {page === "inicio" && <>
      <section className="hero shell">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="spark s1" /><div className="spark s2" />
        <div className="hero-copy"><p className="eyebrow"><span /> LIVRO + EXPERIÊNCIA DE APRENDIZADO</p><h1>Ideias que<br />saem do papel.</h1><p className="lead">Uma jornada para transformar conhecimento em movimento — no seu ritmo, do seu jeito.</p><div className="actions"><button className="primary" onClick={() => go("curso")}>Conheça o curso <span>→</span></button><a className="text-link" href="#livro">Descubra o livro <span>↘</span></a></div></div>
        <div className="hero-art" aria-label="Representação do livro Acenda"><div className="sun-disc" /><div className="book"><div className="book-top"><small>UM LIVRO DE</small><b>AUTOR<br />CONVIDADO</b></div><div className="book-title">ACENDA<span>o que move você</span></div><div className="book-line" /></div><p className="side-note">CONHECIMENTO <span>→</span> AÇÃO</p></div>
        <div className="scroll-hint">ROLE PARA EXPLORAR <span>↓</span></div>
      </section>
      <section id="livro" className="book-section shell"><div className="section-number">01</div><div><p className="eyebrow orange">O LIVRO</p><h2>Não é sobre ler mais.<br />É sobre viver diferente.</h2></div><div className="book-copy"><p><strong>Acenda</strong> é um convite para quem sente que pode ir além, mas precisa de clareza para dar o próximo passo.</p><p>Com histórias, provocações e exercícios práticos, cada capítulo aproxima você da vida que quer construir.</p><button className="text-link dark">Ver detalhes do livro <span>→</span></button></div></section>
      <section id="autor" className="author-section"><div className="shell author-grid"><div className="portrait"><span>AM</span><p>FOTO DO AUTOR</p></div><div className="author-copy"><p className="eyebrow"><span /> QUEM ESCREVE</p><h2>Experiência para<br />compartilhar.<br /><em>Presença para inspirar.</em></h2><p>Autor, educador e palestrante, nosso convidado transforma aprendizados de uma trajetória real em ideias simples, práticas e humanas.</p><div className="author-stats"><div><b>12+</b><span>ANOS ENSINANDO</span></div><div><b>30k</b><span>VIDAS ALCANÇADAS</span></div><div><b>80+</b><span>PALESTRAS</span></div></div></div></div></section>
      <section className="course-call shell"><p className="eyebrow orange">VÁ ALÉM DO LIVRO</p><h2>Aprenda. Pratique.<br /><em>Transforme.</em></h2><p>Uma experiência guiada com aulas curtas, exercícios práticos e materiais para levar as ideias do livro à sua rotina.</p><button className="primary" onClick={() => go("curso")}>Explorar o curso <span>→</span></button></section>
      <section className="contact-section" id="contato"><div className="shell contact-grid"><div><p className="eyebrow"><span /> CONVITES E AGENDA</p><h2>Vamos criar algo<br /><em>memorável?</em></h2><p>Para palestras, eventos, entrevistas ou projetos especiais, conte um pouco sobre sua ideia.</p></div><form onSubmit={submitContact}><label>SEU NOME<input required name="nome" placeholder="Como podemos chamar você?" /></label><label>E-MAIL<input required type="email" name="email" placeholder="voce@empresa.com" /></label><label>ASSUNTO<select name="assunto" defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Palestra ou evento</option><option>Entrevista</option><option>Parceria</option><option>Outro</option></select></label><label>MENSAGEM<textarea required name="mensagem" placeholder="Conte brevemente sobre o convite..." /></label><button className="primary" type="submit">Enviar mensagem <span>→</span></button>{notice && <p className="form-notice" role="status">{notice}</p>}</form></div></section>
    </>}

    {page === "curso" && <section className="course-page shell"><div className="course-intro"><p className="eyebrow orange">CURSO ONLINE · ACESSO POR 1 ANO</p><h1>Do insight<br /><em>à prática.</em></h1><p>Um percurso de 4 módulos para transformar as ideias do livro em decisões, hábitos e resultados consistentes.</p><ul><li>22 aulas objetivas</li><li>4 cadernos de exercícios</li><li>Certificado de conclusão</li><li>Acesso em celular, tablet e computador</li></ul></div><aside className="price-card"><span>EXPERIÊNCIA COMPLETA</span><h3>Curso Acenda</h3><p className="price"><small>12x de</small> R$ 29,70</p><p>ou R$ 297 à vista</p><button className="primary wide" onClick={() => setCheckout(true)}>Quero começar agora <span>→</span></button><small>Compra segura · 7 dias de garantia</small></aside><div className="curriculum"><p className="eyebrow orange">CONTEÚDO DO CURSO</p><h2>Seu caminho, passo a passo.</h2>{modules.map(m => <div className="module" key={m.n}><span>{m.n}</span><div><b>{m.title}</b><small>{m.meta}</small></div><span>{m.open ? "▶" : "⌁"}</span></div>)}</div></section>}

    {page === "area" && <section className="student shell"><div className="student-head"><div><p className="eyebrow orange">MINHA ÁREA</p><h1>{purchased ? "Que bom ter você aqui." : "Sua jornada começa aqui."}</h1><p>{purchased ? "Continue de onde parou e mantenha seu aprendizado em movimento." : "Adquira o curso para liberar todas as aulas, exercícios e seu certificado."}</p></div><span className="avatar">AM</span></div>{!purchased ? <div className="locked"><div className="lock-icon">⌁</div><h2>Conteúdo exclusivo</h2><p>Você ainda não possui acesso ao Curso Acenda.</p><button className="primary" onClick={() => go("curso")}>Conhecer o curso <span>→</span></button></div> : <div className="learning"><div className="progress-card"><p>SEU PROGRESSO</p><b>8%</b><div><span /></div><small>2 de 22 aulas concluídas</small></div><h2>Continue aprendendo</h2>{modules.map((m,i) => <button className="lesson" key={m.n}><span className={i ? "locked-dot" : "play-dot"}>{i ? "•" : "▶"}</span><div><b>{m.title}</b><small>{m.meta}</small></div><span>→</span></button>)}</div>}</section>}

    <footer><div className="shell"><div className="brand"><span className="brand-mark">A</span><span>ACENDA</span></div><p>Ideias que saem do papel.</p><div><button onClick={() => go("curso")}>Curso</button><button onClick={() => go("area")}>Minha área</button><a href="#contato">Contato</a></div></div></footer>
    {checkout && <div className="modal-backdrop" onMouseDown={() => setCheckout(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onMouseDown={e => e.stopPropagation()}><button className="close" onClick={() => setCheckout(false)} aria-label="Fechar">×</button><p className="eyebrow orange">DEMONSTRAÇÃO GRATUITA</p><h2 id="checkout-title">Simular compra do curso</h2><p>Esta versão não cobra nada. Ao continuar, o acesso à área de estudos será liberado neste navegador.</p><div className="order"><span>Curso Acenda</span><b>R$ 297,00</b></div><button className="primary wide" onClick={() => { setPurchased(true); setCheckout(false); go("area"); }}>Liberar acesso de demonstração <span>→</span></button><small>Para vendas reais, conecte um meio de pagamento antes de publicar.</small></div></div>}
  </main>;
}
