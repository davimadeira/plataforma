import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta Matheus Vidal para acompanhar cursos e informações pessoais.",
  robots: { index: false, follow: false }
};

export default function SignInPage() {
  return <main className="unified-auth-page">
    <section className="auth-portrait" aria-label="Matheus Vidal">
      <Image src="/autor-principal.png" fill sizes="(max-width: 820px) 100vw, 48vw" alt="Matheus Vidal, pregador da Palavra" priority />
      <div><p>UMA CONTA · DOIS AMBIENTES</p><h1>Seu acesso ao site e aos cursos em um só lugar.</h1></div>
    </section>
    <section className="auth-access-panel">
      <Link className="auth-back" href="/">← Voltar ao site</Link>
      <div className="auth-access-card">
        <Image src="/logo-mv-contrast.png" width={78} height={78} alt="Marca MV" />
        <p className="eyebrow orange">ÁREA DE ACESSO</p>
        <h2>Bem-vindo.</h2>
        <p>Use a mesma conta para acessar sua área pessoal e a plataforma de estudos Matheus Vidal.</p>
        <a className="auth-main-action" href="/auth/login?returnTo=/minha-conta">Entrar com minha conta <span>→</span></a>
        <a className="auth-create-action" href="/auth/login?screen_hint=signup&returnTo=/minha-conta">Ainda não tenho uma conta</a>
        <div className="auth-security"><span>✓</span><p><b>Acesso seguro</b><small>Seus dados e sua sessão são protegidos.</small></p></div>
      </div>
      <small className="auth-help">Ao entrar, você poderá abrir os dois sites sem criar outro cadastro.</small>
    </section>
  </main>;
}
