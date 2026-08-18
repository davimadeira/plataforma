"use client";
/* Product previews can point to freshly uploaded or user-provided URLs. */
/* eslint-disable @next/next/no-img-element */

import { upload } from "@vercel/blob/client";
import { Dispatch, SetStateAction, useState } from "react";
import { ProductColor, StoreProduct } from "../store-data";

type Props = { products: StoreProduct[]; setProducts: Dispatch<SetStateAction<StoreProduct[]>>; pin: string; onStatus: (message: string) => void };

export default function AdminProductEditor({ products, setProducts, pin, onStatus }: Props) {
  const [uploads, setUploads] = useState<Record<string, number>>({});
  function updateProduct(index: number, patch: Partial<StoreProduct>) { setProducts(current => current.map((product, innerIndex) => innerIndex === index ? { ...product, ...patch } : product)); }
  function updateColor(productIndex: number, colorIndex: number, patch: Partial<ProductColor>) { updateProduct(productIndex, { colors: products[productIndex].colors.map((color, innerIndex) => innerIndex === colorIndex ? { ...color, ...patch } : color) }); }
  async function uploadImage(productIndex: number, colorIndex: number, file: File) {
    const key = `${productIndex}-${colorIndex}`;
    setUploads(current => ({ ...current, [key]: 0 }));
    onStatus("Enviando a foto do produto...");
    try {
      const blob = await upload(`products/${products[productIndex].id}/${file.name}`, file, { access: "public", handleUploadUrl: "/api/site-media", clientPayload: JSON.stringify({ pin }), onUploadProgress: event => setUploads(current => ({ ...current, [key]: Math.round(event.percentage) })) });
      updateColor(productIndex, colorIndex, { image: blob.url });
      setUploads(current => ({ ...current, [key]: 100 }));
      onStatus("Foto enviada. Clique em Salvar produtos para publicar.");
    } catch (error) { onStatus(error instanceof Error ? error.message : "Não foi possível enviar a foto."); }
  }
  function addProduct() {
    setProducts(current => [...current, { id: crypto.randomUUID(), name: "Nova camiseta", message: "Mensagem da coleção", price: 99.9, category: "Unissex", badge: "Nova", sizes: ["P", "M", "G", "GG"], colors: [{ name: "Preto", hex: "#171717", image: "/store/jesus-casal.png" }] }]);
  }

  return <section className="products-admin"><header><div><p>CATÁLOGO DA LOJA</p><h2>Produtos e variações</h2></div><button className="admin-secondary" onClick={addProduct}>＋ Adicionar produto</button></header>{products.map((product, productIndex) => <article className="admin-product-card" key={product.id}><div className="admin-product-head"><div className="admin-product-thumb"><img src={product.colors[0]?.image} alt="" /></div><div><small>PRODUTO {String(productIndex + 1).padStart(2, "0")}</small><h3>{product.name}</h3></div><button className="danger" onClick={() => setProducts(current => current.filter((_, index) => index !== productIndex))}>Excluir produto</button></div><div className="admin-product-grid"><label>Nome<input value={product.name} onChange={event => updateProduct(productIndex, { name: event.target.value })} /></label><label>Preço<input type="number" step="0.01" value={product.price} onChange={event => updateProduct(productIndex, { price: Number(event.target.value) })} /></label><label>Categoria<select value={product.category} onChange={event => updateProduct(productIndex, { category: event.target.value as StoreProduct["category"] })}><option>Unissex</option><option>Feminino</option><option>Masculino</option><option>Infantil</option></select></label><label>Selo<input value={product.badge || ""} onChange={event => updateProduct(productIndex, { badge: event.target.value })} placeholder="Nova, Destaque..." /></label><label className="wide">Mensagem<textarea value={product.message} onChange={event => updateProduct(productIndex, { message: event.target.value })} /></label><label className="wide">Tamanhos, separados por vírgula<input value={product.sizes.join(", ")} onChange={event => updateProduct(productIndex, { sizes: event.target.value.split(",").map(value => value.trim()).filter(Boolean) })} /></label></div><div className="admin-colors"><header><b>Cores e fotos</b><button onClick={() => updateProduct(productIndex, { colors: [...product.colors, { name: "Nova cor", hex: "#D8C3A3", image: product.colors[0]?.image || "/store/jesus-casal.png" }] })}>＋ Adicionar cor</button></header>{product.colors.map((color, colorIndex) => { const uploadKey = `${productIndex}-${colorIndex}`; return <div className="admin-color-row" key={`${product.id}-color-${colorIndex}`}><span style={{ background: color.hex }} /><label>Nome<input value={color.name} onChange={event => updateColor(productIndex, colorIndex, { name: event.target.value })} /></label><label>Cor<input type="color" value={color.hex} onChange={event => updateColor(productIndex, colorIndex, { hex: event.target.value })} /></label><label className="image-url">Imagem<input value={color.image} onChange={event => updateColor(productIndex, colorIndex, { image: event.target.value })} /></label><label className="admin-upload">Enviar foto<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => event.target.files?.[0] && uploadImage(productIndex, colorIndex, event.target.files[0])} /></label><button className="remove-color" onClick={() => updateProduct(productIndex, { colors: product.colors.filter((_, index) => index !== colorIndex) })} disabled={product.colors.length === 1}>×</button>{uploads[uploadKey] !== undefined && <small className="admin-upload-progress">{uploads[uploadKey]}%</small>}</div>; })}</div></article>)}</section>;
}
