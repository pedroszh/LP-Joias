import type { JewelKey, SceneKey } from "./images";
import type { PhotoKey } from "./photos";

/**
 * Local catalogue. Shape mirrors what a future API/CMS would return, so the
 * UI only needs `getProducts()` swapped for a fetch when a backend exists.
 */
export type CategoryId = "aneis" | "colares" | "brincos" | "pulseiras" | "relogios";

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  price: number; // BRL, in reais
  photo: PhotoKey; // studio photograph used in cards and listings
  tone: string; // neutral backdrop tuned to the stone
  isNew?: boolean;
  description: string;
};

export const categories: { id: CategoryId; label: string; singular: string }[] = [
  { id: "aneis", label: "Anéis", singular: "Anel" },
  { id: "colares", label: "Colares", singular: "Colar" },
  { id: "brincos", label: "Brincos", singular: "Brincos" },
  { id: "pulseiras", label: "Pulseiras", singular: "Pulseira" },
  { id: "relogios", label: "Relógios", singular: "Relógio" },
];

export const products: Product[] = [
  {
    id: "anel-aurora",
    name: "Anel Aurora",
    category: "aneis",
    price: 4890,
    photo: "anelAurora",
    tone: "#e9efe9",
    description: "Pedra verde em lapidação retangular, garras delicadas e haste cravejada.",
  },
  {
    id: "bracelete-lune",
    name: "Bracelete Lune",
    category: "pulseiras",
    price: 4590,
    photo: "braceleteLune",
    tone: "#efe9df",
    isNew: true,
    description: "Bracelete rígido em ouro polido com um fio de pavê na parte superior.",
  },
  {
    id: "argolas-soleil",
    name: "Argolas Soleil",
    category: "brincos",
    price: 2690,
    photo: "argolasSoleil",
    tone: "#efe9df",
    isNew: true,
    description: "Argolas polidas com uma linha de brilhantes na frente.",
  },
  {
    id: "relogio-aurore",
    name: "Relógio Aurore",
    category: "relogios",
    price: 12900,
    photo: "relogioAurore",
    tone: "#f1ece4",
    isNew: true,
    description: "Caixa redonda em ouro polido, mostrador de madrepérola e índices de brilhantes.",
  },
  {
    id: "colar-coracao",
    name: "Colar Coração",
    category: "colares",
    price: 3980,
    photo: "colarCoracao",
    tone: "#f1e9de",
    description: "Um coração de luz suspenso por uma corrente delicada em ouro.",
  },
  {
    id: "anel-eternite",
    name: "Anel Eternité",
    category: "aneis",
    price: 4290,
    photo: "anelEternite",
    tone: "#efe9df",
    isNew: true,
    description: "Uma volta inteira de brilhantes, para promessas sem fim.",
  },
  {
    id: "pulseira-perle",
    name: "Pulseira Perle",
    category: "pulseiras",
    price: 3290,
    photo: "pulseiraPerle",
    tone: "#f1ece4",
    description: "Fio de pérolas luminosas com fecho polido em ouro.",
  },
  {
    id: "colar-essenza",
    name: "Colar Essenza",
    category: "colares",
    price: 5290,
    photo: "colarEssenza",
    tone: "#e8ebf2",
    description: "Gota azul profunda abraçada por uma linha de luz.",
  },
  {
    id: "brincos-perola",
    name: "Brincos Pérola",
    category: "brincos",
    price: 1990,
    photo: "brincosPerola",
    tone: "#f1ece4",
    description: "Pérolas coroadas por um pequeno ponto de brilho em ouro.",
  },
  {
    id: "anel-perola",
    name: "Anel Pérola",
    category: "aneis",
    price: 2890,
    photo: "anelPerola",
    tone: "#f1ece4",
    isNew: true,
    description: "Uma pérola luminosa sobre um aro delicado de ouro.",
  },
  {
    id: "relogio-emeraude",
    name: "Relógio Émeraude",
    category: "relogios",
    price: 9800,
    photo: "relogioEmeraude",
    tone: "#e9efe9",
    description: "Mostrador verde-esmeralda raiado em caixa de ouro e pulseira de couro champanhe.",
  },
  {
    id: "pulseira-elise",
    name: "Pulseira Élise",
    category: "pulseiras",
    price: 6450,
    photo: "pulseiraElise",
    tone: "#efe8ef",
    description: "Riviera de pedras violeta ovais intercaladas por pontos de brilho.",
  },
  {
    id: "brincos-lumiere",
    name: "Brincos Lumière",
    category: "brincos",
    price: 3690,
    photo: "brincosLumiere",
    tone: "#ebe9f0",
    description: "Par de gotas azuis com acabamento polido e brilhantes laterais.",
  },
  {
    id: "pulseira-elo",
    name: "Pulseira Elo",
    category: "pulseiras",
    price: 3790,
    photo: "pulseiraElo",
    tone: "#efe9df",
    isNew: true,
    description: "Elos ovais encorpados em ouro polido, com fecho de alavanca.",
  },
  {
    id: "relogio-minuit",
    name: "Relógio Minuit",
    category: "relogios",
    price: 15400,
    photo: "relogioMinuit",
    tone: "#ece8e4",
    description: "Luneta cravejada de brilhantes, mostrador negro e pulseira de cetim.",
  },
  {
    id: "anel-solitario",
    name: "Anel Solitário",
    category: "aneis",
    price: 5980,
    photo: "anelSolitario",
    tone: "#f1e7e6",
    description: "Uma única pedra vermelha, presente e silenciosa.",
  },
  {
    id: "colar-signature",
    name: "Colar Signature",
    category: "colares",
    price: 4750,
    photo: "colarSignature",
    tone: "#e7eee9",
    description: "A assinatura da casa em verde profundo.",
  },
  {
    id: "pulseira-diamant",
    name: "Pulseira Diamant",
    category: "pulseiras",
    price: 8900,
    photo: "pulseiraDiamant",
    tone: "#efe9df",
    description: "Brilhantes em degradê, cravejados um a um em ouro amarelo.",
  },
  {
    id: "relogio-eclat",
    name: "Relógio Éclat",
    category: "relogios",
    price: 8700,
    photo: "relogioEclat",
    tone: "#f1e9de",
    description: "Caixa retangular em ouro, numerais romanos e pulseira de couro conhaque.",
  },
  {
    id: "brincos-celeste",
    name: "Brincos Céleste",
    category: "brincos",
    price: 3490,
    photo: "brincosCeleste",
    tone: "#e8eee8",
    description: "Gotas verdes que acompanham cada movimento do rosto.",
  },
  {
    id: "pulseira-riviera",
    name: "Pulseira Riviera",
    category: "pulseiras",
    price: 6120,
    photo: "pulseiraRiviera",
    tone: "#e6edf0",
    description: "Pedras azul-claras em sequência contínua, leve como água.",
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

/** The "01 · 02 · 03" stone stories — each one owns a full colour world. */
export type GemStory = {
  id: string;
  index: string;
  word: string;
  label: string;
  line: string;
  notes: string[];
  image: JewelKey;
  scene: SceneKey;
  /** text colour scheme over the photo */
  theme: "dark" | "light";
  productId: string;
  palette: {
    base: string; // deep background
    mid: string; // light pool colour
    glow: string; // highlight behind the jewel
    accent: string; // small text / outlines
    shadow: string; // cast shadow tint
  };
};

export const gemStories: GemStory[] = [
  {
    id: "esmeralda",
    index: "01",
    word: "esmeralda",
    label: "Nota verde",
    line: "Um verde que guarda a floresta inteira dentro de uma pedra.",
    notes: ["Verde profundo", "Ouro", "Luz de manhã"],
    image: "anelEsmeralda",
    scene: "esmeralda",
    theme: "dark",
    productId: "anel-aurora",
    palette: {
      base: "#0b2a20",
      mid: "#1d5a43",
      glow: "#6fcf9f",
      accent: "#bfe8d3",
      shadow: "#03140e",
    },
  },
  {
    id: "safira",
    index: "02",
    word: "safira",
    label: "Nota azul",
    line: "O azul da hora em que o dia se despede e a noite ainda hesita.",
    notes: ["Azul noturno", "Ouro", "Brilho frio"],
    image: "colarSafira",
    scene: "safira",
    theme: "dark",
    productId: "colar-essenza",
    palette: {
      base: "#0a1433",
      mid: "#1f3a86",
      glow: "#7d9cff",
      accent: "#c9d6ff",
      shadow: "#040919",
    },
  },
  {
    id: "ametista",
    index: "03",
    word: "ametista",
    label: "Nota violeta",
    line: "Violeta de fim de tarde, quente na pele e suave no olhar.",
    notes: ["Violeta", "Ouro", "Pôr do sol"],
    image: "pulseiraAmetista",
    scene: "ametista",
    theme: "light",
    productId: "pulseira-elise",
    palette: {
      base: "#e9d9c2",
      mid: "#f4e9da",
      glow: "#fff6e8",
      accent: "#6b2f7d",
      shadow: "#3d1748",
    },
  },
];
