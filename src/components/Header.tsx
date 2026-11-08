import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useOverlay } from "../lib/useLockBody";
import { cn, EASE } from "../lib/utils";
import { Logo } from "./Logo";

export const NAV = [
  { id: "inicio", label: "Início" },
  { id: "colecao", label: "Coleção" },
  { id: "sobre", label: "Sobre a marca" },
  { id: "contato", label: "Contato" },
];

export function Header() {
  const { count, setCartOpen, setSearchOpen } = useStore();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    // tuck away while reading downward, return on any upward intent
    setHidden(y > 600 && y > prev + 4);
  });

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useOverlay(menuOpen, closeMenu);

  // pulse the bag when its count changes
  const [bump, setBump] = useState(0);
  useEffect(() => setBump((b) => b + 1), [count]);

  const iconBtn =
    "relative grid h-11 w-11 place-items-center rounded-full transition-colors duration-300 hover:bg-current/10";

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: hidden && !menuOpen ? "-100%" : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: hidden ? 0 : 0.2 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500",
          solid && !menuOpen
            ? "bg-ivory/85 text-ink shadow-[0_1px_0_rgba(17,17,17,0.06)] backdrop-blur-xl"
            : menuOpen ? "bg-transparent text-ivory" : "bg-transparent text-ink",
        )}
      >
        <div className="container-luxe grid h-[72px] grid-cols-[1fr_auto_1fr] items-center lg:h-[84px]">
          <nav aria-label="Principal" className="hidden items-center gap-8 xl:flex">
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="link-underline whitespace-nowrap py-1 text-[0.7rem] font-medium uppercase tracking-[0.24em]">
                {item.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className={cn(iconBtn, "-ml-2 xl:hidden")}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} strokeWidth={1.4} /> : <Menu size={20} strokeWidth={1.4} />}
          </button>

          <a href="#inicio" aria-label="Vellaré — página inicial" onClick={closeMenu}>
            <Logo />
          </a>

          <div className="flex items-center justify-end gap-1">
            <button type="button" className={iconBtn} aria-label="Buscar joias" onClick={() => setSearchOpen(true)}>
              <Search size={19} strokeWidth={1.4} />
            </button>
            <button
              type="button"
              className={iconBtn}
              aria-label={`Abrir sacola, ${count} ${count === 1 ? "item" : "itens"}`}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={19} strokeWidth={1.4} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={bump}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-champagne px-1 text-[0.6rem] font-bold text-ink"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink text-ivory xl:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(198,166,107,0.22),transparent_60%)]"
            />
            <nav aria-label="Menu móvel" className="relative mt-28 flex flex-col gap-2 px-6">
              {NAV.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={closeMenu}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.25 + i * 0.07 }}
                  className="flex items-baseline gap-4 border-b border-ivory/10 py-4"
                >
                  <span className="eyebrow text-champagne">0{i + 1}</span>
                  <span className="display text-5xl">{item.label}</span>
                </motion.a>
              ))}
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative mt-auto px-6 pb-10 text-sm text-ivory/50"
            >
              contato@vellare.example · Atendimento com hora marcada
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
