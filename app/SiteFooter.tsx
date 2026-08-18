import Image from "next/image";
import Link from "next/link";

const platformUrl = "https://cursos-matheus-vidal.vercel.app";

export default function SiteFooter() {
  return <footer><div className="shell">
    <Link className="brand official-brand" href="/" aria-label="Página inicial de Matheus Vidal">
      <Image src="/logo-mv-contrast.png" width={52} height={52} alt="Marca MV" />
      <span>MATHEUS VIDAL</span>
    </Link>
    <p>Fé, propósito e mensagens que transformam.</p>
    <div><Link href="/livro">Livro</Link><Link href="/loja">Loja</Link><a href={platformUrl}>Cursos</a></div>
  </div></footer>;
}
