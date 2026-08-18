import { list, put } from "@vercel/blob";
import { defaultProducts } from "../../store-data";

const pathname = "settings/products.json";

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json(defaultProducts);
  try {
    const { blobs } = await list({ prefix: pathname, limit: 1 });
    if (!blobs[0]) return Response.json(defaultProducts);
    const response = await fetch(blobs[0].url, { cache: "no-store" });
    return Response.json(await response.json());
  } catch { return Response.json(defaultProducts); }
}
export async function PUT(request: Request) {
  const expectedPin = process.env.ADMIN_PIN || "2026";
  if (request.headers.get("x-admin-pin") !== expectedPin) return Response.json({ error: "PIN incorreto." }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "Conecte o Vercel Blob para salvar produtos." }, { status: 503 });
  try {
    const products = await request.json();
    await put(pathname, JSON.stringify(products), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
    return Response.json({ ok: true });
  } catch { return Response.json({ error: "Não foi possível salvar os produtos." }, { status: 500 }); }
}
