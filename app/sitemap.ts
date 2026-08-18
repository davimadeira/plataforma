import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base = "https://plataforma-theta-seven.vercel.app"; return ["", "/livro", "/loja"].map((path, index) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: index ? "weekly" : "monthly", priority: index ? 0.9 : 1 })); }

