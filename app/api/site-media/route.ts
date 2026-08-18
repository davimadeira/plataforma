import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "Conecte o Vercel Blob ao projeto." }, { status: 503 });
  try {
    const body = await request.json() as HandleUploadBody;
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const expectedPin = process.env.ADMIN_PIN || "2026";
        const receivedPin = JSON.parse(clientPayload || "{}").pin;
        if (receivedPin !== expectedPin) throw new Error("PIN incorreto");
        return { allowedContentTypes: ["image/jpeg", "image/png", "image/webp"], maximumSizeInBytes: 15 * 1024 * 1024, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {},
    });
    return Response.json(response);
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Falha no envio." }, { status: 400 }); }
}
