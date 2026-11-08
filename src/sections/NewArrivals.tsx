import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Plus } from "lucide-react";
import { Photo } from "../components/Photo";
import { Reveal, RevealLines } from "../components/Reveal";
import { categories, products } from "../data/catalog";
import { useStore } from "../context/StoreContext";
import { EASE, formatPrice } from "../lib/utils";

export function NewArrivals() {
  const { showInShop, add } = useStore();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const featY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["12%", "-12%"]);

  const fresh = products.filter((p) => p.isNew);
  const feature = fresh.find((p) => p.id === "bracelete-lune") ?? fresh[0];
  const rest = fresh.filter((p) => p !== feature);
  if (!feature) return null;

  return (
    <section ref={ref} id="novidades" aria-labelledby="new-title" className="overflow-hidden bg-ivory py-28 lg:py-40">
      <div className="container-luxe">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="eyebrow flex items-center gap-4 text-champagne-deep">
                <span className="h-px w-10 bg-champagne" /> Lançamentos
              </p>
            </Reveal>
            <RevealLines
              lines={["Novas formas", <em key="e" className="text-champagne-deep">de brilhar.</em>]}
              className="display mt-6 text-[clamp(3rem,8vw,7.5rem)]"
            />
          </div>
          <Reveal delay={0.2} className="flex flex-col justify-end gap-6 lg:col-span-4">
            <p className="text-[0.98rem] leading-[1.85] text-mist">
              Peças recém-chegadas ao ateliê, desenhadas para quem gosta de ser a primeira a sentir.
            </p>
            <button
              type="button"
              onClick={() => showInShop("novidades")}
              className="btn-luxe group w-fit bg-ink text-ivory hover:bg-champagne hover:text-ink"
            >
              Explorar lançamentos
              <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* feature */}
          <motion.article
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.3, ease: EASE }}
            className="group relative isolate min-h-[600px] overflow-hidden bg-sand text-ivory lg:col-span-7 lg:min-h-[760px]"
          >
            <motion.div style={{ y: featY }} className="absolute -inset-y-[8%] inset-x-0">
              <Photo
                name={feature.photo}
                sizes="(min-width:1024px) 55vw, 95vw"
                className="transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-105"
              />
            </motion.div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 lg:p-10">
              <div>
                <p className="eyebrow text-champagne">Novo · {categories.find((c) => c.id === feature.category)?.singular}</p>
                <h3 className="display mt-2 text-5xl lg:text-7xl">{feature.name}</h3>
                <p className="mt-2 max-w-xs text-sm text-ivory/80">{feature.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-serif text-2xl">{formatPrice(feature.price)}</span>
                <button
                  type="button"
                  onClick={() => add(feature.id)}
                  aria-label={`Adicionar ${feature.name} à sacola`}
                  className="grid h-12 w-12 place-items-center rounded-full bg-ivory text-ink transition hover:bg-champagne"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </motion.article>

          {/* numbered list */}
          <ol className="flex flex-col lg:col-span-5">
            {rest.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 1.1, ease: EASE, delay: i * 0.1 }}
                className="group flex items-center gap-5 border-b border-ink/10 py-6 first:pt-0 lg:gap-8 lg:py-8"
              >
                <span className="font-serif text-sm italic text-champagne-deep">0{i + 2}</span>
                <div className="h-28 w-28 shrink-0 overflow-hidden lg:h-36 lg:w-36" style={{ background: p.tone }}>
                  <Photo
                    name={p.photo}
                    sizes="144px"
                    className="transition-transform duration-1000 ease-[var(--ease-luxe)] group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-2xl lg:text-3xl">{p.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-mist">{p.description}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="text-sm tabular-nums">{formatPrice(p.price)}</span>
                    <button
                      type="button"
                      onClick={() => add(p.id)}
                      className="link-underline min-h-9 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-champagne-deep"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
