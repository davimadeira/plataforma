"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStoreCart } from "./StoreCart";

const platformUrl = "https://cursos-matheus-vidal.vercel.app";

export default function SiteHeader({ active = "inicio" }: { active?: "inicio" | "livro" | "loja" }) {
  const pathname = usePathname();
  const router = useRouter();
  const cart = useStoreCart();
  function openCart() {
    if (pathname === "/loja") cart.setOpen(true);
    else router.push("/loja?cart=1");
  }
  return <header className="site-header-wrap"><div className="nav shell site-header">
    <Link className="brand official-brand" href="/" aria-label="Ir para a página inicial de Matheus Vidal">
      <Image src="/logo-mv-contrast.png" width={64} height={64} alt="Marca MV — Matheus Vidal, Lais e Antonella" priority />
      <span><b>MATHEUS VIDAL</b><small>FÉ · PROPÓSITO · MOVIMENTO</small></span>
    </Link>
    <nav aria-label="Navegação principal">
      <Link className={active === "inicio" ? "active" : ""} href="/">Início</Link>
      <Link href="/#sobre">Sobre</Link>
      <Link className={active === "livro" ? "active" : ""} href="/livro">Livro</Link>
      <Link className={active === "loja" ? "active" : ""} href="/loja">Loja</Link>
      <a href={platformUrl}>Cursos</a>
    </nav>
    <div className="header-actions"><button className="header-cart" onClick={openCart} aria-label={`Abrir sacola com ${cart.count} itens`}><span aria-hidden="true">▱</span><small>Sacola</small><b>{cart.count}</b></button><Link className="login" href="/#contato">Fale comigo <span>↗</span></Link></div>
  </div></header>;
}
