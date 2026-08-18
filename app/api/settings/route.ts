import { env } from "cloudflare:workers";
const defaults={whatsapp:"",bookTitle:"Livro de Matheus Vidal",bookPrice:"49,90",purchaseUrl:""};
async function ensure(){await env.DB.prepare("CREATE TABLE IF NOT EXISTS site_settings (id INTEGER PRIMARY KEY, data TEXT NOT NULL, updated_at INTEGER NOT NULL)").run()}
export async function GET(){await ensure();const row=await env.DB.prepare("SELECT data FROM site_settings WHERE id=1").first<{data:string}>();return Response.json(row?JSON.parse(row.data):defaults)}
export async function PUT(request:Request){await ensure();const data=await request.json();await env.DB.prepare("INSERT INTO site_settings (id,data,updated_at) VALUES (1,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at").bind(JSON.stringify(data),Date.now()).run();return Response.json({ok:true})}
