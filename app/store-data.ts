export type ProductColor = { name: string; hex: string; image: string };
export type StoreProduct = {
  id: string;
  name: string;
  message: string;
  price: number;
  category: "Unissex" | "Feminino" | "Masculino" | "Infantil";
  badge?: string;
  sizes: string[];
  colors: ProductColor[];
};

export const defaultProducts: StoreProduct[] = [
  {
    id: "jesus-nome",
    name: "Jesus — O nome sobre todo nome",
    message: "Jesus no centro de tudo · Filipenses 2:9-11",
    price: 99.9,
    category: "Unissex",
    badge: "Destaque",
    sizes: ["P", "M", "G", "GG"],
    colors: [
      { name: "Preto", hex: "#171717", image: "/store/jesus-casal.png" },
      { name: "Bege", hex: "#D8C3A3", image: "/store/jesus-bege.png" },
      { name: "Off-white", hex: "#F2EEE5", image: "/store/jesus-offwhite.png" },
    ],
  },
  { id: "coroa-espinhos", name: "Coroa de Espinhos", message: "Ele foi ferido por nossas transgressões · Isaías 53:5", price: 94.9, category: "Unissex", badge: "Coleção", sizes: ["P", "M", "G", "GG"], colors: [{ name: "Preto", hex: "#171717", image: "/store/colecao-preta.png" }] },
  { id: "jesus-cruz", name: "Jesus — Filipenses 2:9", message: "O nome que está sobre todo nome", price: 94.9, category: "Unissex", sizes: ["P", "M", "G", "GG"], colors: [{ name: "Preto", hex: "#171717", image: "/store/jesus-cruz.png" }] },
  { id: "negue-se", name: "Negue-se — Lucas 9:23", message: "Tome cada dia a sua cruz e siga-me", price: 94.9, category: "Unissex", badge: "Nova", sizes: ["P", "M", "G", "GG"], colors: [{ name: "Preto", hex: "#171717", image: "/store/negue-se.png" }] },
  { id: "mvla-bege", name: "MV Essencial Bege", message: "Família, fé e propósito", price: 99.9, category: "Unissex", sizes: ["P", "M", "G", "GG"], colors: [{ name: "Bege", hex: "#D8C3A3", image: "/store/mvla-bege.png" }] },
];
