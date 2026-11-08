import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type CategoryId, type Product } from "../data/catalog";
import { scrollToId, storage } from "../lib/utils";

export type ShopFilter = "todos" | "novidades" | CategoryId;

type CartLine = { id: string; qty: number };
type CartAction =
  | { type: "add"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

const CART_KEY = "vellare:cart";
const MAX_QTY = 9;

function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add": {
      const line = state.find((l) => l.id === action.id);
      if (line) return state.map((l) => (l.id === action.id ? { ...l, qty: Math.min(l.qty + 1, MAX_QTY) } : l));
      return [...state, { id: action.id, qty: 1 }];
    }
    case "setQty":
      if (action.qty <= 0) return state.filter((l) => l.id !== action.id);
      return state.map((l) => (l.id === action.id ? { ...l, qty: Math.min(action.qty, MAX_QTY) } : l));
    case "remove":
      return state.filter((l) => l.id !== action.id);
    case "clear":
      return [];
  }
}

type StoreValue = {
  lines: (CartLine & { product: Product })[];
  count: number;
  subtotal: number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  filter: ShopFilter;
  showInShop: (filter: ShopFilter) => void;
  setFilter: (filter: ShopFilter) => void;
  toast: string | null;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [raw, dispatch] = useReducer(cartReducer, undefined, () =>
    // drop lines whose product no longer exists in the catalogue
    storage.get<CartLine[]>(CART_KEY, []).filter((l) => getProduct(l.id) && l.qty > 0),
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filter, setFilter] = useState<ShopFilter>("todos");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => storage.set(CART_KEY, raw), [raw]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const lines = useMemo(
    () => raw.map((l) => ({ ...l, product: getProduct(l.id)! })).filter((l) => l.product),
    [raw],
  );
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0);

  const add = useCallback((id: string) => {
    dispatch({ type: "add", id });
    const p = getProduct(id);
    if (p) setToast(`${p.name} foi adicionado à sacola`);
  }, []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "setQty", id, qty }), []);
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);

  const showInShop = useCallback((next: ShopFilter) => {
    setFilter(next);
    setSearchOpen(false);
    requestAnimationFrame(() => scrollToId("vitrine"));
  }, []);

  const value: StoreValue = {
    lines,
    count,
    subtotal,
    add,
    setQty,
    remove,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    filter,
    setFilter,
    showInShop,
    toast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
