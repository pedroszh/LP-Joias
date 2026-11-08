import { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Plus } from "lucide-react";
import { RevealLines } from "../components/Reveal";
import { gemStories, getProduct, type GemStory } from "../data/catalog";
import { sceneFrames, scenes } from "../data/images";
import { useStore } from "../context/StoreContext";
import { cn, EASE, formatPrice } from "../lib/utils";

/**
 * Pinned full-screen stone showcase.
 * 1. The panel arrives inset with rounded corners and grows to full bleed.
 * 2. While pinned, scrolling down raises each next photograph from the bottom
 *    like a curtain over the previous one (01 → 02 → 03).
 * 3. After the last stone the page continues normally.
 */
export function GemStories() {
  const n = gemStories.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  // entry: inset card → full screen as the track reaches the top
  const { scrollYProgress: enter } = useScroll({ target: trackRef, offset: ["start end", "start start"] });
  const inset = useTransform(enter, [0.35, 1], reduce ? [0, 0] : [4, 0]);
  const radius = useTransform(enter, [0.35, 1], reduce ? [0, 0] : [28, 0]);
  const clip = useTransform([inset, radius], ([i, r]) => `inset(${i}% ${i}% 0% ${i}% round ${r}px ${r}px 0 0)`);

  // pinned progress: short hold at both ends, one curtain wipe per extra stone
  const { scrollYProgress: pinned } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const steps = useTransform(pinned, [0.08, 0.92], [0, n - 1], { clamp: true });
  const counter = useTransform(steps, [0, n - 1], [1 / n, 1]);

  useMotionValueEvent(steps, "change", (v) => {
    const next = Math.min(n - 1, Math.max(0, Math.round(v)));
    setActive((cur) => (cur === next ? cur : next));
  });

  const light = gemStories[active].theme === "light";

  return (
    <section id="pedras" aria-labelledby="gems-title" className="relative bg-ivory">
      <div className="container-luxe flex flex-col gap-8 pb-14 pt-6 lg:flex-row lg:items-end lg:justify-between lg:pb-16">
        <RevealLines
          lines={["Três pedras,", <em key="i" className="text-champagne-deep">nota a nota.</em>]}
          className="display text-[clamp(2.8rem,7vw,6.5rem)]"
        />
        <p className="max-w-sm text-[0.98rem] leading-[1.85] text-mist lg:pb-3">
          Cada pedra inspira um universo próprio de cor. Continue rolando para atravessar o verde, o azul e o violeta da
          coleção Lumière.
        </p>
      </div>
      <span id="gems-title" className="sr-only">
        Coleção Lumière: esmeralda, safira e ametista
      </span>

      {/* tall track: the sticky stage stays on screen while the wipes play */}
      <div ref={trackRef} className="relative" style={{ height: `${(n - 1) * 100 + 130}svh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-ink">
            {gemStories.map((story, i) => (
              <Layer key={story.id} story={story} index={i} steps={steps} active={active === i} reduce={!!reduce} />
            ))}

            {/* counter, bottom right — like the reference */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute bottom-6 right-[4%] z-30 hidden items-center gap-4 text-[0.65rem] font-semibold tracking-[0.3em] transition-colors duration-700 sm:flex",
                light ? "text-ink/70" : "text-ivory/70",
              )}
            >
              <span className="tabular-nums">{gemStories[active].index}</span>
              <span className="relative h-px w-14 bg-current/30">
                <motion.span className="absolute inset-0 origin-left bg-current" style={{ scaleX: counter }} />
              </span>
              <span className="tabular-nums">0{n}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Layer({
  story,
  index,
  steps,
  active,
  reduce,
}: {
  story: GemStory;
  index: number;
  steps: MotionValue<number>;
  active: boolean;
  reduce: boolean;
}) {
  const { add } = useStore();
  const product = getProduct(story.productId);
  const scene = scenes[story.scene];
  const c = story.palette;
  const light = story.theme === "light";

  const frames = sceneFrames[story.scene];

  // Everything below animates with transforms only (GPU-composited, no repaint):
  // the layer window slides up from the bottom while its content is counter-shifted,
  // which reads as a curtain uncovering a still photograph.
  const windowY = useTransform(steps, (s) => {
    if (index === 0) return "0%";
    const r = Math.min(1, Math.max(0, s - (index - 1)));
    return `${(1 - r) * 100}%`;
  });
  const contentY = useTransform(steps, (s) => {
    if (index > 0 && s < index) {
      const r = Math.min(1, Math.max(0, s - (index - 1)));
      return `${-(1 - r) * (reduce ? 100 : 88)}%`;
    }
    const t = Math.min(1, Math.max(0, s - index));
    return `${reduce ? 0 : -6 * t}%`;
  });
  const dim = useTransform(steps, [index, index + 1], [0, 0.45], { clamp: true });

  const wordStyle = {
    "--wfs-m": `${Math.min(30, 205 / story.word.length).toFixed(1)}vw`,
    "--wfs-d": `clamp(4rem, ${Math.min(21, 140 / story.word.length).toFixed(1)}vw, 21rem)`,
    color: light ? c.shadow : "#f8f5f0",
  } as CSSProperties;

  return (
    <motion.article
      aria-label={`${story.index} — ${story.word}`}
      className="absolute inset-0 overflow-hidden will-change-transform"
      style={{ y: windowY, zIndex: index + 1, backgroundColor: c.base }}
    >
      <motion.div style={{ y: contentY }} className="absolute inset-0 will-change-transform">
        {/* one pre-baked full-frame photograph: 16:9 on landscape screens, 9:16 on phones */}
        <picture>
          <source media="(max-aspect-ratio: 4/5)" srcSet={frames.tall} />
          <img
            src={frames.wide}
            alt={scene.alt}
            draggable={false}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>

        {/* legibility veils */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: light
              ? "linear-gradient(to bottom, rgba(255,250,242,0.55), transparent 30%, transparent 62%, rgba(255,248,238,0.6))"
              : "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 32%, transparent 60%, rgba(0,0,0,0.55))",
          }}
        />

        {/* outline numeral */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ opacity: active ? (light ? 0.5 : 0.6) : 0, x: active ? 0 : -30 }}
          transition={{ duration: 1, ease: EASE, delay: active ? 0.15 : 0 }}
          className="outline-numeral absolute left-[4%] top-[12%] font-serif text-[clamp(5.5rem,15vw,15rem)] font-light leading-none"
          style={{ color: light ? c.shadow : "#f8f5f0" }}
        >
          {story.index}
        </motion.span>

        {/* note block + product */}
        <motion.div
          initial={false}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }}
          transition={{ duration: 0.9, ease: EASE, delay: active ? 0.25 : 0 }}
          className={cn(
            "absolute right-[5%] top-[13%] w-[52%] sm:top-[15%] sm:w-auto sm:max-w-[21rem] sm:p-6",
            light ? "text-ink sm:bg-[#fbf6ee]/70" : "text-ivory sm:bg-black/30",
            !active && "pointer-events-none",
          )}
        >
          <p className="eyebrow flex items-center gap-3" style={{ color: c.accent }}>
            <span className="hidden h-px w-7 sm:block" style={{ background: c.accent }} />
            {story.label}
          </p>
          <p className="mt-3 hidden font-serif text-2xl leading-snug opacity-90 sm:block">{story.line}</p>
          <p className="mt-3 hidden text-[0.6rem] font-semibold uppercase tracking-[0.3em] opacity-70 sm:block">
            {story.notes.join(" · ")}
          </p>
          {product && (
            <div className="mt-4 sm:mt-7">
              <p className="font-serif text-lg leading-tight sm:text-xl">{product.name}</p>
              <p className="text-sm opacity-75">{formatPrice(product.price)}</p>
              <button
                type="button"
                tabIndex={active ? 0 : -1}
                onClick={() => add(product.id)}
                className={cn(
                  "btn-luxe mt-4 min-h-11 border px-4 text-[0.6rem] sm:px-6",
                  light
                    ? "border-ink/25 bg-white/40 hover:bg-ink hover:text-ivory"
                    : "border-white/30 bg-white/10 hover:bg-ivory hover:text-ink",
                )}
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>
          )}
        </motion.div>

        {/* giant word — letters rise when this stone takes the stage */}
        <motion.h3
          initial={false}
          animate={active ? "show" : "hidden"}
          variants={{
            show: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
            hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
          }}
          style={wordStyle}
          className="absolute -bottom-[0.2em] left-[3%] whitespace-nowrap font-serif text-[length:var(--wfs-m)] font-semibold leading-none tracking-[-0.04em] sm:text-[length:var(--wfs-d)]"
        >
          <span className="sr-only">{story.word}</span>
          {story.word.split("").map((ch, k) => (
            <span key={k} aria-hidden className="inline-block overflow-hidden pb-[0.05em] align-bottom">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: reduce ? "0%" : "105%", transition: { duration: 0.5, ease: EASE } },
                  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </motion.h3>

      </motion.div>

      {/* darken as the next stone rises over this one */}
      <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
    </motion.article>
  );
}
