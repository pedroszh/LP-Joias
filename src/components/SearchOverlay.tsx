import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { categories, products } from "../data/catalog";
import { useStore } from "../context/StoreContext";
import { useOverlay } from "../lib/useLockBody";
import { EASE, formatPrice } from "../lib/utils";
import { Photo } from "./Photo";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, add, showInShop } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => setSearchOpen(false), [setSearchOpen]);
  useOverlay(searchOpen, close);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return products.filter((p) => {
      const cat = categories.find((c) => c.id === p.category)?.label ?? "";
      return normalize(`${p.name} ${cat} ${p.description}`).includes(q);
    });
  }, [query]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Buscar joias"
          className="fixed inset-0 z-[60] overflow-y-auto bg-ink/95 text-ivory backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="container-luxe pb-16 pt-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={close}
                className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-ivory/10"
                aria-label="Fechar busca"
              >
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="mx-auto mt-10 max-w-3xl"
            >
              <label htmlFor="search-input" className="eyebrow text-champagne">
                O que você procura?
              </label>
              <div className="mt-4 flex items-center gap-4 border-b border-ivory/25 pb-3 focus-within:border-champagne">
                <Search size={26} strokeWidth={1.2} className="shrink-0 text-ivory/60" />
                <input
                  ref={inputRef}
                  id="search-input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Anel, colar, safira…"
                  autoComplete="off"
                  className="w-full bg-transparent font-serif text-3xl font-light outline-none placeholder:text-ivory/30 sm:text-5xl"
                />
              </div>

              {!query.trim() && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => showInShop(c.id)}
                      className="min-h-11 rounded-full border border-ivory/20 px-5 text-xs uppercase tracking-[0.2em] transition hover:border-champagne hover:text-champagne"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}

              {query.trim() && (
                <div className="mt-8" aria-live="polite">
                  {results.length === 0 ? (
                    <p className="text-ivory/60">
                      Nenhuma joia encontrada para “{query}”. Tente “anel” ou “colar”.
                    </p>
                  ) : (
                    <ul className="divide-y divide-ivory/10">
                      {results.map((p) => (
                        <li key={p.id} className="flex items-center gap-5 py-4">
                          <div className="h-20 w-20 shrink-0 overflow-hidden bg-ivory/5">
                            <Photo name={p.photo} sizes="80px" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-2xl">{p.name}</p>
                            <p className="text-sm text-ivory/50">{formatPrice(p.price)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => add(p.id)}
                            className="btn-luxe min-h-11 border border-ivory/25 px-4 text-[0.62rem] hover:border-champagne hover:text-champagne"
                          >
                            Adicionar <ArrowUpRight size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
