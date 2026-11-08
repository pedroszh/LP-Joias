import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Photo } from "../components/Photo";
import { Reveal, RevealLines } from "../components/Reveal";
import { products, type CategoryId } from "../data/catalog";
import type { PhotoKey } from "../data/photos";
import { useStore } from "../context/StoreContext";
import { cn, EASE } from "../lib/utils";

type Tile = {
  id: CategoryId;
  label: string;
  kicker: string;
  photo: PhotoKey;
  className: string;
  sizes: string;
  /** object-position for the photo, so the jewel stays in frame on narrow screens */
  focus?: string;
  /** below lg, put the caption at the top so it doesn't cover the jewel */
  captionTopOnMobile?: boolean;
};

const TILES: Tile[] = [
  {
    id: "aneis",
    label: "Anéis",
    kicker: "Promessas que se usam",
    photo: "anelEternite",
    className: "min-h-[440px] lg:col-span-7 lg:min-h-[720px]",
    sizes: "(min-width:1024px) 56vw, 100vw",
  },
  {
    id: "colares",
    label: "Colares",
    kicker: "Luz junto ao coração",
    photo: "colarEssenza",
    className: "min-h-[520px] lg:col-span-5 lg:mt-32 lg:min-h-[588px]",
    sizes: "(min-width:1024px) 40vw, 100vw",
  },
  {
    id: "pulseiras",
    label: "Pulseiras",
    kicker: "O brilho em movimento",
    photo: "editorialPulso",
    className: "min-h-[380px] lg:col-span-7 lg:min-h-[440px]",
    sizes: "(min-width:1024px) 56vw, 100vw",
  },
  {
    id: "brincos",
    label: "Brincos",
    kicker: "Detalhes que emolduram",
    photo: "editorialOrelha",
    className: "min-h-[420px] lg:col-span-5 lg:min-h-[440px]",
    sizes: "(min-width:1024px) 40vw, 100vw",
  },
  {
    id: "relogios",
    label: "Relógios",
    kicker: "O tempo, em ouro",
    photo: "editorialRelogio",
    className: "min-h-[520px] lg:col-span-12 lg:min-h-[560px]",
    sizes: "100vw",
    // the watch sits on the right of a landscape photo: pan to it on phones/tablets
    focus: "object-[82%_50%] lg:object-center",
    captionTopOnMobile: true,
  },
];

export function Collections() {
  return (
    <section id="colecao" aria-labelledby="collections-title" className="bg-ivory py-28 lg:py-40">
      <div className="container-luxe">
        <div className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow flex items-center gap-4 text-champagne-deep">
                <span className="h-px w-10 bg-champagne" /> Coleções
              </p>
            </Reveal>
            <RevealLines
              lines={["Escolha a forma", <em key="e" className="text-champagne-deep">do seu brilho.</em>]}
              className="display mt-6 text-[clamp(2.8rem,6.5vw,6rem)]"
            />
          </div>
          <Reveal delay={0.2} className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[0.98rem] leading-[1.85] text-mist">
              Cinco famílias de peças, um mesmo olhar: linhas limpas, pedras de cor intensa e o calor do ouro — agora também no pulso.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          {TILES.map((tile, i) => (
            <CollectionTile key={tile.id} tile={tile} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionTile({ tile, index }: { tile: Tile; index: number }) {
  const { showInShop } = useStore();
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["10%", "-10%"]);
  const count = products.filter((p) => p.category === tile.id).length;

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => showInShop(tile.id)}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.2, ease: EASE, delay: (index % 2) * 0.12 }}
      aria-label={`Explorar ${tile.label}`}
      className={cn(
        "grain group relative isolate flex flex-col overflow-hidden text-left",
        "text-ivory",
        tile.className,
      )}
    >
      {/* photograph, drifting slightly with the scroll */}
      <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0 -z-10">
        <Photo
          name={tile.photo}
          sizes={tile.sizes}
          className={cn(
            "transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.05]",
            tile.focus,
          )}
        />
      </motion.div>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 transition-opacity duration-700 group-hover:opacity-80",
          tile.captionTopOnMobile
            ? "bg-gradient-to-b from-black/60 via-black/5 to-transparent lg:bg-gradient-to-t lg:from-black/65"
            : "bg-gradient-to-t from-black/65 via-black/5 to-transparent",
        )}
      />

      <div
        className={cn(
          "absolute inset-x-0 flex justify-between gap-4 p-6 lg:p-9",
          tile.captionTopOnMobile ? "top-0 items-start lg:bottom-0 lg:top-auto lg:items-end" : "bottom-0 items-end",
        )}
      >
        <div>
          <p className={cn("eyebrow transition-opacity duration-500 group-hover:opacity-100", "text-champagne-light opacity-90")}>
            0{index + 1} · {tile.kicker}
          </p>
          <p className="display mt-2 text-5xl transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:-translate-y-1 lg:text-7xl">
            {tile.label}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3">
          <span className="text-xs opacity-60 transition-opacity duration-500 group-hover:opacity-100">
            {count} {count === 1 ? "peça" : "peças"}
          </span>
          <span
            className="grid h-12 w-12 place-items-center rounded-full border border-ivory/40 transition-all duration-500 group-hover:rotate-45 group-hover:border-champagne group-hover:bg-champagne group-hover:text-ink"
          >
            <ArrowUpRight size={18} strokeWidth={1.4} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
