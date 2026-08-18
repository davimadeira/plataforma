import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plataforma Acenda — cursos online",
  description: "Cursos, aulas, exercícios e progresso em uma plataforma de estudos completa.",
  openGraph: { title: "Plataforma Acenda — aprenda no seu ritmo", description: "Conheça o curso e acesse sua área de estudos.", images: [{ url: "/og.png", width: 1734, height: 909 }] },
  twitter: { card: "summary_large_image", title: "Plataforma Acenda — aprenda no seu ritmo", description: "Conheça o curso e acesse sua área de estudos.", images: ["/og.png"] }
};

export default function PlatformLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
