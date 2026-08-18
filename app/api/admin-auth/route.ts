export async function POST(request: Request) {
  const expectedPin = process.env.ADMIN_PIN || "2026";
  const authorized = request.headers.get("x-admin-pin") === expectedPin;
  return Response.json({ authorized }, { status: authorized ? 200 : 401 });
}
