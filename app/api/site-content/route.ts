import { normalizeSiteContent, readSiteContent, writeSiteContent } from "../../../lib/site-content";

export async function GET() {
  try {
    return Response.json(await readSiteContent(), { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ error: "Não foi possível carregar o conteúdo do site." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const expectedPin = process.env.ADMIN_PIN || "2026";
  if (request.headers.get("x-admin-pin") !== expectedPin) return Response.json({ error: "PIN incorreto." }, { status: 401 });
  try {
    const content = normalizeSiteContent(await request.json());
    await writeSiteContent(content);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Não foi possível publicar o conteúdo." }, { status: 500 });
  }
}
