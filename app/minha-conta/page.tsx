import Link from "next/link";
import { redirect } from "next/navigation";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import { auth0 } from "../../lib/auth0";

const courseUrl = "https://cursos-matheus-vidal.vercel.app";

function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "MV";
}

export default async function AccountPage() {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login?returnTo=/minha-conta");

  const name = session.user.name || session.user.nickname || session.user.email || "Aluno";
  const email = session.user.email || "E-mail protegido";

  return <main className="institutional account-page">
    <SiteHeader />
    <section className="account-hero shell">
      <div className="account-avatar">{initials(String(name))}</div>
      <div><p className="eyebrow"><span /> MINHA CONTA</p><h1>Olá, {String(name).split(" ")[0]}.</h1><p>Seu acesso está conectado ao site oficial e à plataforma de estudos.</p></div>
      <a className="account-logout" href="/auth/logout?returnTo=/">Sair da conta</a>
    </section>
    <section className="account-content shell">
      <aside className="account-profile"><small>DADOS DO PERFIL</small><h2>{String(name)}</h2><p>{String(email)}</p><span>Conta verificada</span></aside>
      <div className="account-destinations">
        <a href={`${courseUrl}/auth/login?returnTo=/`}><small>01 · ESTUDOS</small><h2>Meus cursos</h2><p>Acesse as formações disponíveis e continue de onde parou.</p><b>Abrir plataforma <span>↗</span></b></a>
        <Link href="/loja"><small>02 · COMPRAS</small><h2>Loja MV</h2><p>Conheça as coleções, escolha cores e acompanhe suas compras futuras.</p><b>Visitar a loja <span>→</span></b></Link>
        <Link href="/livro"><small>03 · LEITURA</small><h2>Livro</h2><p>Conheça a obra de Matheus Vidal e acesse a experiência de compra.</p><b>Conhecer o livro <span>→</span></b></Link>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
