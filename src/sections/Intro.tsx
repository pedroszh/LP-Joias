import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Photo } from "../components/Photo";
import { Reveal, RevealLines } from "../components/Reveal";
import { EASE } from "../lib/utils";

export function Intro() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bigY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["8%", "-8%"]);
  const smallY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["30%", "-30%"]);

  return (
    <section id="detalhes" ref={ref} aria-labelledby="intro-title" className="relative overflow-hidden bg-ivory py-28 lg:py-44">
      <div className="container-luxe grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-champagne-deep">
              <span className="h-px w-10 bg-champagne" /> Manifesto
            </p>
          </Reveal>
          <RevealLines
            lines={["A beleza", <em key="e" className="text-champagne-deep">está nos</em>, "detalhes."]}
            className="display mt-8 text-[clamp(3rem,7vw,6.5rem)]"
          />
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-md text-[1.02rem] leading-[1.9] text-mist">
              Cada joia carrega uma intenção. Do primeiro desenho ao acabamento final, cada detalhe é pensado para
              transformar momentos especiais em memórias que permanecem.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-ink/10 pt-8">
            {[
              ["Desenho", "Linha"],
              ["Luz", "Brilho"],
              ["Gesto", "Memória"],
            ].map(([a, b]) => (
              <div key={a}>
                <p className="font-serif text-2xl">{a}</p>
                <p className="eyebrow mt-1 text-mist-light">{b}</p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* editorial composition: arched frame + floating detail card */}
        <div className="relative lg:col-span-6 lg:col-start-7">
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0 round 999px 999px 0 0)" }}
            whileInView={{ clipPath: "inset(0% 0 0 0 round 999px 999px 0 0)" }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.6, ease: EASE }}
            className="grain relative mx-auto aspect-[4/5] w-[86%] overflow-hidden rounded-t-full bg-[radial-gradient(ellipse_at_50%_35%,#f3ead9_0%,#e4d3b3_45%,#c9ad7c_100%)] lg:w-[78%]"
          >
            <motion.div style={{ y: bigY }} className="absolute -inset-y-[10%] inset-x-0">
              <Photo name="editorialMao" sizes="(min-width:1024px) 40vw, 86vw" className="object-[50%_60%]" />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: smallY }}
            className="absolute -bottom-10 left-0 w-[46%] bg-ink p-5 text-ivory shadow-2xl sm:p-6 lg:-left-8 lg:w-[40%]"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <Photo name="anelPerola" sizes="260px" />
            </div>
            <p className="eyebrow mt-4 text-champagne">Nº 03 — Pérola</p>
            <p className="mt-1 font-serif text-lg italic text-ivory/80">O detalhe que muda tudo.</p>
          </motion.div>

          <p aria-hidden className="eyebrow absolute right-0 top-6 hidden origin-top-right -rotate-90 translate-x-full text-mist-light lg:block">
            Vellaré · Atelier conceitual
          </p>
        </div>
      </div>
    </section>
  );
}
