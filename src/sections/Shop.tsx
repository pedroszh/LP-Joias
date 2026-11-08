import { forwardRef, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Heart, Plus } from "lucide-react";
import { Photo } from "../components/Photo";
import { Reveal, RevealLines } from "../components/Reveal";
import { categories, products, type Product } from "../data/catalog";
import { useStore, type ShopFilter } from "../context/StoreContext";
import { cn, EASE, formatPrice, storage } from "../lib/utils";

const FILTERS: { id: ShopFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "novidades", label: "Novidades" },
  ...categories.map((c) => ({ id: c.id as ShopFilter, label: c.label })),
];

const FAV_KEY = "vellare:favs";

export function Shop() {
  const { filter, setFilter } = useStore();
  const [favs, setFavs] = useState<string[]>(() => storage.get<string[]>(FAV_KEY, []));

  const toggleFav = (id: string) =>
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      storage.set(FAV_KEY, next);
      return next;
    });

  const visible = useMemo(
    () =>
      products.filter((p) =>
        filter === "todos" ? true : filter === "novidades" ? p.isNew : p.category === filter,
      ),
    [filter],
  );

  return (
    <section id="vitrine" aria-labelledby="shop-title" className="scroll-mt-20 bg-white py-28 lg:py-40">
      <div className="container-luxe">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow flex items-center gap-4 text-champagne-deep">
                <span className="h-px w-10 bg-champagne" /> A vitrine
              </p>
            </Reveal>
            <RevealLines
              lines={["Joias para", <em key="e" className="text-champagne-deep">ficar.</em>]}
              className="display mt-6 text-[clamp(2.8rem,6.5vw,6rem)]"
            />
          </div>

          <LayoutGroup id="filters">
            <div
              role="tablist"
              aria-label="Filtrar joias"
              className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
            >
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    aria-controls="shop-grid"
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "relative min-h-11 shrink-0 rounded-full px-5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-500",
                      active ? "text-ivory" : "text-mist hover:text-ink",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 -z-0 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        <p className="mt-10 text-xs text-mist" aria-live="polite">
          {visible.length} {visible.length === 1 ? "peça" : "peças"}
        </p>

        <motion.ul
          id="shop-grid"
          layout
          className="mt-5 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-16"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} fav={favs.includes(p.id)} onFav={() => toggleFav(p.id)} />
            ))}
          </AnimatePresence>
        </motion.ul>

        {visible.length === 0 && (
          <div className="py-24 text-center">
            <p className="display text-4xl">Nenhuma peça por aqui — ainda.</p>
            <button type="button" onClick={() => setFilter("todos")} className="link-underline mt-4 text-sm text-mist">
              Ver todas as joias
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

type CardProps = { product: Product; index: number; fav: boolean; onFav: () => void };

// forwardRef: AnimatePresence "popLayout" measures the exiting element
const ProductCard = forwardRef<HTMLLIElement, CardProps>(function ProductCard({ product, index, fav, onFav }, ref) {
  const { add } = useStore();
  const category = categories.find((c) => c.id === product.category)?.singular;

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 4) * 0.06 }}
      // stagger heights for an editorial rhythm on desktop
      className={cn("group", index % 4 === 1 && "lg:mt-16", index % 4 === 3 && "lg:mt-8")}
    >
      <div className="relative overflow-hidden" style={{ background: product.tone }}>
        <div className="aspect-[4/5] transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]">
          <Photo name={product.photo} sizes="(min-width:1024px) 22vw, 48vw" />
        </div>
        {/* sheen sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:animate-[sheen_1.4s_ease] group-hover:opacity-100"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.25em] text-ivory sm:left-4 sm:top-4">
            Novo
          </span>
        )}
        <button
          type="button"
          onClick={onFav}
          aria-pressed={fav}
          aria-label={fav ? `Remover ${product.name} dos favoritos` : `Favoritar ${product.name}`}
          className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full text-ink transition hover:bg-white/60"
        >
          <Heart size={17} strokeWidth={1.4} className={cn("transition", fav && "fill-ink")} />
        </button>
        <button
          type="button"
          onClick={() => add(product.id)}
          aria-label={`Adicionar ${product.name} à sacola`}
          className="absolute bottom-2 right-2 grid h-11 w-11 place-items-center rounded-full bg-ink text-ivory transition-all duration-500 hover:bg-champagne hover:text-ink lg:inset-x-3 lg:bottom-3 lg:flex lg:h-12 lg:w-auto lg:translate-y-[130%] lg:items-center lg:justify-center lg:gap-3 lg:rounded-none lg:text-[0.62rem] lg:font-semibold lg:uppercase lg:tracking-[0.26em] lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
        >
          <Plus size={16} strokeWidth={1.6} />
          <span aria-hidden className="hidden lg:inline">
            Adicionar à sacola
          </span>
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-mist-light">{category}</p>
          <h3 className="mt-1 font-serif text-xl leading-tight sm:text-2xl">{product.name}</h3>
        </div>
        <p className="text-sm tabular-nums text-ink/80">{formatPrice(product.price)}</p>
      </div>
    </motion.li>
  );
});
