import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Photo } from "../components/Photo";
import { Reveal, RevealLines } from "../components/Reveal";
import { EASE } from "../lib/utils";

const PILLARS = [
  {
    n: "01",
    title: "Desenho",
    text: "Linhas imaginadas para atravessar o tempo, longe das tendências passageiras.",
  },
  {
    n: "02",
    title: "Luz",
    text: "Cada peça nasce da pergunta: como a luz vai atravessá-la ao longo do dia?",
  },
  {
    n: "03",
    title: "Gesto",
    text: "Joias para acompanhar o cotidiano, e não apenas as grandes ocasiões.",
  },
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["14%", "-14%"]);
  const word = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["10%", "-25%"]);

  return (
    <section id="sobre" ref={ref} aria-labelledby="about-title" className="relative overflow-hidden bg-white py-28 lg:py-44">
      <motion.p
        aria-hidden
        style={{ x: word }}
        className="pointer-events-none absolute left-0 top-10 whitespace-nowrap font-serif text-[22vw] font-light italic leading-none text-sand"
      >
        philosophie · philosophie
      </motion.p>

      <div className="container-luxe relative grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-5">
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.6, ease: EASE }}
            className="grain relative aspect-[3/4] overflow-hidden bg-ink"
          >
            <motion.div style={{ y }} className="absolute -inset-y-[14%] inset-x-0">
              <Photo name="editorialColo" sizes="(min-width:1024px) 36vw, 92vw" className="object-[50%_65%]" />
            </motion.div>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
            <p className="absolute bottom-5 left-5 font-serif text-sm italic text-ivory/90">Colar Coração</p>
          </motion.div>
          <div aria-hidden className="absolute -bottom-6 -right-6 -z-10 hidden h-1/2 w-1/2 border border-champagne/50 lg:block" />
        </div>

        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-champagne-deep">
              <span className="h-px w-10 bg-champagne" /> Sobre a marca
            </p>
          </Reveal>
          <RevealLines
            lines={["Uma casa", <em key="e" className="text-champagne-deep">imaginada</em>, "para a luz."]}
            className="display mt-6 text-[clamp(2.8rem,6vw,5.6rem)]"
          />
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-lg text-[1.02rem] leading-[1.9] text-mist">
              Vellaré nasce de uma ideia simples: uma joia não é um objeto, é um marco. Inspirada nas campanhas
              editoriais e no silêncio dos ateliês, a marca imagina peças em que forma, cor e brilho conversam sem
              excessos — para que o protagonismo seja sempre de quem as usa.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 border-t border-ink/10 pt-10 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={0.1 * i}>
                <p className="font-serif text-sm italic text-champagne-deep">{p.n}</p>
                <h3 className="mt-2 font-serif text-3xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{p.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p className="mt-12 text-xs leading-relaxed text-mist-light">
              Vellaré é uma marca conceitual criada para esta experiência digital. Produtos, preços e textos são
              ilustrativos.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
