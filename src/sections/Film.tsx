import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Reveal, RevealLines } from "../components/Reveal";
import filmWide from "../assets/video/filme-lumiere.mp4";
import filmTall from "../assets/video/filme-lumiere-vertical.mp4";
import posterWide from "../assets/video/filme-lumiere-poster.webp";
import posterTall from "../assets/video/filme-lumiere-vertical-poster.webp";

/**
 * Full-screen brand film (silent loop rendered by `scripts/brand_film.py`).
 * Plays only while on screen and picks the portrait cut on tall screens; with
 * reduced motion it stays on its poster frame.
 */
export function Film() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 4/5)");
    const update = () => setPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // play only while visible
  useEffect(() => {
    const el = ref.current;
    const video = videoRef.current;
    if (!el || !video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduce) video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, portrait]);

  return (
    <section ref={ref} aria-labelledby="film-title" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink text-ivory">
      <video
        key={portrait ? "tall" : "wide"}
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={portrait ? filmTall : filmWide}
        poster={portrait ? posterTall : posterWide}
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />

      <div className="container-luxe relative flex h-full flex-col justify-end pb-14 lg:pb-20">
        <Reveal>
          <p className="eyebrow text-champagne-light">Lumière — o filme</p>
        </Reveal>
        <RevealLines
          lines={["Feito para ser", <em key="e">visto de perto.</em>]}
          className="display mt-5 max-w-3xl text-[clamp(2.6rem,6vw,5.6rem)]"
        />
        <span id="film-title" className="sr-only">
          Lumière, o filme: feito para ser visto de perto
        </span>
        <Reveal delay={0.2} className="mt-8">
          <p className="max-w-md text-[0.98rem] leading-relaxed text-ivory/75">
            Esmeralda, safira, ametista e ouro — a coleção em movimento.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
