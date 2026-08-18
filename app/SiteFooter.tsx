import Image from "next/image";

const platformUrl = "https://cursos-matheus-vidal.vercel.app";

export default function SiteFooter() {
  return <footer><div className="shell">
    <a className="brand official-brand" href="/" aria-label="Página inicial de Matheus Vidal">
      <Image src="/logo-mvla.png" width={52} height={52} alt="Logo MVLA" />
      <span>MATHEUS VIDAL</span>
    </a>
    <p>Fé, propósito e mensagens que transformam.</p>
    <div><a href="/livro">Livro</a><a href="/loja">Loja</a><a href={platformUrl}>Cursos</a></div>
  </div></footer>;
}

