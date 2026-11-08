import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Glints } from "../components/Glints";
import { JewelImage } from "../components/JewelImage";
import { ribbon } from "../data/images";
import { getProduct } from "../data/catalog";
import { useStore } from "../context/StoreContext";
import { EASE, formatPrice, scrollToId } from "../lib/utils";

const HERO_PRODUCT = "colar-coracao";

// floating gold dust + soft bokeh, positioned once (deterministic for SSR-like stability)
const DUST = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  top: `${30 + ((i * 37) % 65)}%`,
  size: 2 + ((i * 7) % 5),
  delay: -(i * 0.9),
  duration: 9 + ((i * 5) % 7),
}));
const BOKEH = [
  { left: "8%", top: "22%", size: 90, delay: 0 },
  { left: "86%", top: "16%", size: 60, delay: -3 },
  { left: "74%", top: "70%", size: 120, delay: -6 },
  { left: "18%", top: "78%", size: 70, delay: -2 },
  { left: "60%", top: "8%", size: 40, delay: -4 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { add } = useStore();
  const product = getProduct(HERO_PRODUCT);

  // scroll choreography: necklace drifts down, ribbon slower, copy lifts away
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const neckY = useTransform(p, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const ribbonY = useTransform(p, [0, 1], ["0%", reduce ? "0%" : "30%"]);
  const ribbonScale = useTransform(p, [0, 1], [1, reduce ? 1 : 1.08]);
  const textY = useTransform(p, [0, 1], [0, reduce ? 0 : -110]);
  const textOpacity = useTransform(p, [0, 0.5], [1, 0]);
  const watermarkY = useTransform(p, [0, 1], ["0%", reduce ? "0%" : "-40%"]);

  // gentle pointer parallax on desktop
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const ribbonX = useTransform(smx, (v) => v * -18);
  const ribbonPY = useTransform(smy, (v) => v * -10);
  const neckX = useTransform(smx, (v) => v * 10);
  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <section
      id="inicio"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-[#f6efe6] text-ink"
    >
      {/* ——— 1 · luminous silk background ——— */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,#fffdf9_0%,#f8efe3_45%,#ecdcc8_100%)]" />
        {/* silk folds */}
        <svg className="animate-drift absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="silk-a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="silk-b" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e8d2b4" stopOpacity="0" />
              <stop offset="0.5" stopColor="#e2c9a6" stopOpacity="0.55" />
              <stop offset="1" stopColor="#e8d2b4" stopOpacity="0" />
            </linearGradient>
            <filter id="silk-blur">
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>
          <g filter="url(#silk-blur)">
            <path d="M-100 620 C 260 470, 520 760, 860 600 S 1360 420, 1560 560 L 1560 760 C 1260 640, 1020 860, 700 800 S 160 700, -100 820 Z" fill="url(#silk-b)" />
            <path d="M-100 560 C 300 400, 560 700, 900 540 S 1380 360, 1560 480 L 1560 540 C 1300 470, 1040 690, 760 660 S 200 520, -100 640 Z" fill="url(#silk-a)" />
            <path d="M-100 180 C 280 80, 640 260, 980 150 S 1400 60, 1560 140 L 1560 200 C 1200 160, 1000 320, 640 280 S 160 160, -100 260 Z" fill="url(#silk-a)" opacity="0.7" />
          </g>
        </svg>
        {/* bokeh */}
        {BOKEH.map((b, i) => (
          <span
            key={i}
            className="animate-float-soft absolute rounded-full border border-white/70 bg-white/30 shadow-[inset_0_0_20px_rgba(255,255,255,0.8)] blur-[1px]"
            style={{ left: b.left, top: b.top, width: b.size, height: b.size, animationDelay: `${b.delay}s` }}
          />
        ))}
        {/* rising gold dust */}
        {DUST.map((d, i) => (
          <span
            key={i}
            className="animate-rise absolute rounded-full bg-champagne"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
              boxShadow: "0 0 8px 2px rgba(226,207,164,0.9)",
            }}
          />
        ))}
      </motion.div>

      {/* giant watermark brand, like the reference */}
      <motion.p
        aria-hidden
        style={{ y: watermarkY }}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: EASE, delay: 0.2 }}
        className="pointer-events-none absolute inset-x-0 top-[17%] -z-10 select-none text-center font-modern text-[19vw] font-bold leading-none tracking-[-0.04em] text-champagne/[0.13] sm:top-[14%]"
      >
        Vellaré
      </motion.p>

      {/* ——— 2 · ribbon of stones & pearls behind the necklace ——— */}
      <motion.div
        aria-hidden
        style={{ y: ribbonY, scale: ribbonScale }}
        className="pointer-events-none absolute left-1/2 top-[30%] -z-0 w-[150vw] -translate-x-1/2 sm:top-[46%] sm:w-[104vw] lg:top-[41%] lg:w-[min(76vw,1220px)]"
      >
        <motion.div style={{ x: ribbonX, y: ribbonPY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 2, ease: EASE, delay: 0.5 }}
          >
            <div className="animate-ribbon relative">
              <img
                src={ribbon.src}
                srcSet={`${ribbon.srcSm} 900w, ${ribbon.src} ${ribbon.width}w`}
                sizes="(min-width:1024px) 80vw, 150vw"
                width={ribbon.width}
                height={ribbon.height}
                alt=""
                className="h-auto w-full drop-shadow-[0_30px_40px_rgba(120,90,50,0.22)]"
              />
              {/* light sweeping across the satin */}
              <span
                className="absolute inset-0 overflow-hidden mix-blend-overlay"
                style={{
                  maskImage: `url(${ribbon.srcSm})`,
                  WebkitMaskImage: `url(${ribbon.srcSm})`,
                  maskSize: "100% 100%",
                  WebkitMaskSize: "100% 100%",
                }}
              >
                <span className="animate-sheen-slow absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              </span>
              <Glints
                color="#fff8e7"
                glints={[
                  { x: "14%", y: "40%", size: 22, delay: 0.8 },
                  { x: "33%", y: "70%", size: 16, delay: 2.1 },
                  { x: "74%", y: "34%", size: 24, delay: 1.4 },
                  { x: "88%", y: "22%", size: 14, delay: 3.2 },
                  { x: "80%", y: "66%", size: 18, delay: 2.7 },
                ]}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ——— 3 · the necklace, hanging from the top edge and swaying ——— */}
      <motion.div
        style={{ y: neckY, x: neckX }}
        className="absolute left-1/2 top-0 z-10 h-[50svh] -translate-x-1/2 sm:h-[62svh] lg:h-[74svh]"
      >
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, ease: EASE, delay: 0.9 }}
          style={{ transformOrigin: "50% 0%" }}
        >
          {/* pendant sits left of the photo's centre: nudge so the heart is centred */}
          <div className="animate-sway relative h-full translate-x-[8%]">
            <JewelImage
              name="colarCoracao"
              priority
              sizes="(min-width:1024px) 42vh, 40vh"
              className="h-full w-auto max-w-none drop-shadow-[0_26px_26px_rgba(90,60,25,0.28)]"
            />
            <Glints
              color="#ffffff"
              glints={[
                { x: "36%", y: "80%", size: 30, delay: 2.4 },
                { x: "48%", y: "88%", size: 16, delay: 3.6 },
                { x: "30%", y: "90%", size: 12, delay: 4.4 },
              ]}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ——— 4 · copy ——— */}
      <motion.div style={{ y: textY, opacity: textOpacity }} className="container-luxe relative z-20 h-full font-modern">
        {/* left block */}
        <div className="absolute inset-x-5 bottom-[9%] sm:inset-x-8 lg:inset-x-auto lg:bottom-auto lg:left-14 lg:top-[21%] lg:max-w-[34rem]">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.1 }}
            className="flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-champagne-deep"
          >
            <span className="h-px w-8 bg-champagne-deep" /> Coleção Lumière
          </motion.p>
          <h1 id="hero-title" className="mt-5 text-[clamp(2.1rem,3.5vw,3.4rem)] font-light leading-[1.08] tracking-[-0.02em]">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
              >
                Mais do que joias.
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.65 }}
              >
                Eternize <strong className="font-semibold text-champagne-deep">momentos.</strong>
              </motion.span>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.3 }}
            className="mt-5 max-w-[19rem] text-[0.82rem] leading-relaxed text-ink/60"
          >
            Peças criadas para acompanhar histórias, celebrar conquistas e revelar sua essência.
          </motion.p>
          <motion.button
            type="button"
            onClick={() => scrollToId("colecao")}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.45 }}
            className="group mt-7 inline-flex min-h-11 items-center gap-4 text-[0.66rem] font-semibold uppercase tracking-[0.28em]"
          >
            Descobrir coleção
            <span className="grid h-11 w-11 place-items-center rounded-full border border-ink/25 transition-all duration-500 group-hover:border-champagne-deep group-hover:bg-champagne-deep group-hover:text-ivory">
              <ArrowRight size={15} strokeWidth={1.6} className="transition-transform duration-500 group-hover:translate-x-0.5" />
            </span>
          </motion.button>
        </div>

        {/* right block */}
        {product && (
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 1.5 }}
            className="absolute right-14 top-[27%] hidden w-[18rem] lg:block"
          >
            <p className="flex items-center gap-3 text-[1.6rem] font-light tracking-[-0.01em]">
              <span className="relative h-px w-12 bg-ink/40">
                <span className="absolute -left-1 -top-[3px] h-[7px] w-[7px] rounded-full bg-champagne-deep" />
              </span>
              Mais <strong className="font-semibold text-champagne-deep">brilho.</strong>
            </p>
            <div className="ml-[3.75rem] mt-3 border-l border-ink/15 pl-4 text-[0.72rem] leading-relaxed text-ink/60">
              <p>{product.name} · ouro amarelo</p>
              <p>Ponto de luz em coração</p>
              <button
                type="button"
                onClick={() => add(product.id)}
                className="link-underline mt-3 min-h-9 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-ink"
              >
                {formatPrice(product.price)} — Adicionar
              </button>
            </div>
          </motion.div>
        )}

        {/* scroll cue */}
        <motion.a
          href="#detalhes"
          aria-label="Rolar para a próxima seção"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink/40 transition hover:text-ink lg:flex"
        >
          <span className="relative h-10 w-px overflow-hidden bg-ink/10">
            <span className="animate-scroll-cue absolute inset-0 bg-champagne-deep" />
          </span>
          <ArrowDown size={13} />
        </motion.a>
      </motion.div>
    </section>
  );
}
