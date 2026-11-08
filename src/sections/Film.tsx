import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { Reveal, RevealLines } from "../components/Reveal";
import filmWide from "../assets/video/filme-lumiere.mp4";
import filmTall from "../assets/video/filme-lumiere-vertical.mp4";
import posterWide from "../assets/video/filme-lumiere-poster.webp";
import posterTall from "../assets/video/filme-lumiere-vertical-poster.webp";

/**
 * Full-screen brand film (silent loop rendered by `scripts/brand_film.py`).
 * Plays only while on screen, picks the portrait cut on tall screens, and can be
 * paused; with reduced motion it waits on its poster until the visitor presses play.
 */
export function Film() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [portrait, setPortrait] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 4/5)");
    const update = () => setPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduce) setPaused(true);
  }, [reduce]);

  // play only while visible (and not paused by the visitor)
  useEffect(() => {
    const el = ref.current;
    const video = videoRef.current;
    if (!el || !video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !paused) video.play().catch(() => setPaused(true));
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [paused, portrait]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (paused) {
      video.play().catch(() => undefined);
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  return (
    <section ref={ref} aria-labelledby="film-title" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink text-ivory">
      <video
        key={portrait ? "tall" : "wide"}
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={portrait ? filmTall : filmWide}
        poster={portrait ? posterTall : posterWide}
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
        <div className="mt-8 flex items-center justify-between gap-6">
          <Reveal delay={0.2}>
            <p className="max-w-md text-[0.98rem] leading-relaxed text-ivory/75">
              Esmeralda, safira, ametista e ouro — a coleção em movimento.
            </p>
          </Reveal>
          <button
            type="button"
            onClick={toggle}
            aria-label={paused ? "Reproduzir o filme" : "Pausar o filme"}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ivory/40 transition hover:bg-ivory hover:text-ink"
          >
            {paused ? <Play size={16} strokeWidth={1.6} /> : <Pause size={16} strokeWidth={1.6} />}
          </button>
        </div>
      </div>
    </section>
  );
}
