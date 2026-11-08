import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Plus } from "lucide-react";
import { Glints } from "../components/Glints";
import { Reveal, RevealLines } from "../components/Reveal";
import { campaign } from "../data/images";
import { getProduct } from "../data/catalog";
import { useStore } from "../context/StoreContext";
import { EASE, formatPrice } from "../lib/utils";

const PRODUCT_ID = "colar-coracao";
const MARQUEE = ["Lumière", "Vellaré", "Eternize momentos", "Lumière", "Vellaré", "Eternize momentos"];

/** Editorial campaign moment: framed photograph, the line, a close-up and a slow marquee. */
export function Campaign() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { add, showInShop } = useStore();
  const product = getProduct(PRODUCT_ID);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);
  const photoScale = useTransform(scrollYProgress, [0, 0.5], reduce ? [1, 1] : [1.15, 1.02]);
  const detailY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["40%", "-40%"]);
  const marqueeX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-30%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="campaign-title"
      className="grain relative overflow-hidden bg-[#0e0d0c] pb-16 pt-28 text-ivory lg:pb-20 lg:pt-36"
    >
      {/* warm glow behind the photograph */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(circle,rgba(198,166,107,0.22),transparent_65%)] blur-2xl"
      />

      <div className="container-luxe relative grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        {/* ——— copy ——— */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-champagne">
              <span className="h-px w-10 bg-champagne" /> Campanha · Lumière
            </p>
          </Reveal>
          <RevealLines
            lines={[
              "Algumas coisas",
              "não precisam",
              <em key="e" className="text-champagne-light">
                de palavras.
              </em>,
            ]}
            className="display mt-8 text-[clamp(2.9rem,5.6vw,5.8rem)]"
          />
          <span id="campaign-title" className="sr-only">
            Algumas coisas não precisam de palavras
          </span>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-[1rem] leading-[1.9] text-ivory/60">
              Um coração de luz, suspenso por uma corrente delicada. Feito para ser presente — e para dizer, em
              silêncio, tudo o que importa.
            </p>
          </Reveal>

          {product && (
            <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-ivory/10 pt-8">
              <div>
                <p className="font-serif text-2xl">{product.name}</p>
                <p className="mt-1 text-sm text-ivory/50">{formatPrice(product.price)}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => add(product.id)}
                  className="btn-luxe bg-champagne text-ink hover:bg-ivory"
                >
                  <Plus size={15} /> Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => showInShop("colares")}
                  className="btn-luxe group border border-ivory/25 hover:border-champagne hover:text-champagne"
                >
                  Ver colares
                  <ArrowRight size={15} className="transition-transform duration-500 group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>
          )}
        </div>

        {/* ——— photograph ——— */}
        <div className="relative order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          {/* hairline frame offset behind the photo */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, x: 20, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
            className="absolute -right-4 -top-4 bottom-8 left-8 border border-champagne/40 lg:-right-6 lg:-top-6"
          />

          <motion.div
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.6, ease: EASE }}
            className="relative mx-auto aspect-[4/5] max-h-[82svh] w-full overflow-hidden bg-[#2a221a]"
          >
            <motion.img
              src={campaign.main.src}
              srcSet={`${campaign.main.srcSm} 760w, ${campaign.main.src} ${campaign.main.width}w`}
              sizes="(min-width:1024px) 46vw, 92vw"
              width={campaign.main.width}
              height={campaign.main.height}
              alt={campaign.main.alt}
              loading="lazy"
              decoding="async"
              style={{ y: photoY, scale: photoScale }}
              className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <Glints
              glints={[
                { x: "47%", y: "62%", size: 30, delay: 0.6 },
                { x: "54%", y: "68%", size: 14, delay: 1.9 },
                { x: "44%", y: "70%", size: 18, delay: 3.1 },
              ]}
            />
            <p className="absolute bottom-5 left-5 font-serif text-sm italic text-ivory/80">Colar Coração, ouro amarelo</p>
          </motion.div>

          {/* floating close-up */}
          <motion.figure
            style={{ y: detailY }}
            className="absolute -bottom-10 -left-4 w-[34%] max-w-[230px] bg-[#0e0d0c] p-2 shadow-[0_30px_60px_rgba(0,0,0,0.6)] sm:-left-8 lg:-left-16"
          >
            <motion.img
              src={campaign.detail.src}
              width={campaign.detail.width}
              height={campaign.detail.height}
              alt={campaign.detail.alt}
              loading="lazy"
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.6 }}
              className="aspect-[5/6] w-full object-cover"
            />
            <figcaption className="eyebrow px-1 pb-1 pt-3 text-[0.55rem] text-champagne">Nº 01 — Detalhe</figcaption>
          </motion.figure>
        </div>
      </div>

      {/* slow outline marquee driven by scroll */}
      <div aria-hidden className="relative mt-28 overflow-hidden whitespace-nowrap lg:mt-36">
        <motion.p style={{ x: marqueeX }} className="flex gap-12 font-serif text-[clamp(4rem,11vw,10rem)] font-light italic leading-none">
          {MARQUEE.map((word, i) => (
            <span key={i} className={i % 3 === 1 ? "text-champagne/70" : "outline-numeral text-ivory/25"}>
              {word} <span className="not-italic text-champagne/50">·</span>
            </span>
          ))}
        </motion.p>
      </div>
    </section>
  );
}
