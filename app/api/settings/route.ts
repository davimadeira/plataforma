import { list, put } from "@vercel/blob";

const defaults = { whatsapp: "5527988792894", bookTitle: "Livro de Matheus Vidal", bookPrice: "49,90", purchaseUrl: "" };
const pathname = "settings/site.json";

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json(defaults);
  try {
    const { blobs } = await list({ prefix: pathname, limit: 1 });
    if (!blobs[0]) return Response.json(defaults);
    const response = await fetch(blobs[0].url, { cache: "no-store" });
    return Response.json({ ...defaults, ...await response.json() });
  } catch { return Response.json(defaults); }
}

export async function PUT(request: Request) {
  const expectedPin = process.env.ADMIN_PIN || "2026";
  if (request.headers.get("x-admin-pin") !== expectedPin) return Response.json({ error: "Não autorizado." }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "Conecte o Vercel Blob ao projeto para salvar." }, { status: 503 });
  try {
    const settings = await request.json();
    await put(pathname, JSON.stringify(settings), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
    return Response.json({ ok: true });
  } catch { return Response.json({ error: "Não foi possível salvar as configurações." }, { status: 500 }); }
}
