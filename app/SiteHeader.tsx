import Image from "next/image";

const platformUrl = "https://cursos-matheus-vidal.vercel.app";

export default function SiteHeader({ active = "inicio" }: { active?: "inicio" | "livro" | "loja" }) {
  return <header className="nav shell site-header">
    <a className="brand official-brand" href="/" aria-label="Ir para a página inicial de Matheus Vidal">
      <Image src="/logo-mvla.png" width={58} height={58} alt="Logo MVLA — Matheus Vidal, Lais e Antonella" priority />
      <span>MATHEUS VIDAL</span>
    </a>
    <nav aria-label="Navegação principal">
      <a className={active === "inicio" ? "active" : ""} href="/">Início</a>
      <a href="/#sobre">Sobre</a>
      <a className={active === "livro" ? "active" : ""} href="/livro">Livro</a>
      <a className={active === "loja" ? "active" : ""} href="/loja">Loja</a>
      <a href={platformUrl}>Cursos</a>
    </nav>
    <a className="login" href="/#contato">Fale comigo <span>↗</span></a>
  </header>;
}

