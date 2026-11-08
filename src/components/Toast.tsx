import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { EASE } from "../lib/utils";

export function Toast() {
  const { toast, setCartOpen } = useStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="pointer-events-auto flex items-center gap-4 bg-ink py-3 pl-4 pr-3 text-sm text-ivory shadow-2xl"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-champagne text-ink">
              <Check size={13} strokeWidth={2.4} />
            </span>
            <span>{toast}</span>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="min-h-9 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-champagne hover:text-ivory"
            >
              Ver sacola
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
