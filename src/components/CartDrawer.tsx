import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useOverlay } from "../lib/useLockBody";
import { EASE, formatPrice } from "../lib/utils";
import { Photo } from "./Photo";

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, subtotal, count, setQty, remove, showInShop } = useStore();
  const close = useCallback(() => setCartOpen(false), [setCartOpen]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [notice, setNotice] = useState(false);
  useOverlay(cartOpen, close);

  useEffect(() => {
    if (cartOpen) {
      setNotice(false);
      requestAnimationFrame(() => closeRef.current?.focus());
    }
  }, [cartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Sacola de compras">
          <motion.button
            type="button"
            aria-label="Fechar sacola"
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-ink/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={close}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-ivory text-ink shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <div>
                <p className="eyebrow text-mist">Sua sacola</p>
                <p className="mt-1 font-serif text-2xl">
                  {count} {count === 1 ? "peça" : "peças"}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-ink/5"
                aria-label="Fechar sacola"
              >
                <X size={20} strokeWidth={1.4} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full border border-champagne/50 text-champagne">
                  <ShoppingBag size={26} strokeWidth={1.2} />
                </div>
                <p className="display mt-6 text-3xl">Sua sacola está vazia</p>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  Descubra peças pensadas para acompanhar seus momentos.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    showInShop("todos");
                  }}
                  className="btn-luxe mt-8 bg-ink text-ivory hover:bg-champagne hover:text-ink"
                >
                  Explorar joias
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map(({ id, qty, product }) => (
                      <motion.li
                        key={id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="flex gap-4 py-5"
                      >
                        <div className="h-24 w-24 shrink-0 overflow-hidden" style={{ background: product.tone }}>
                          <Photo name={product.photo} sizes="96px" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-serif text-xl leading-tight">{product.name}</p>
                              <p className="mt-1 text-xs text-mist">{formatPrice(product.price)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(id)}
                              className="grid h-9 w-9 place-items-center rounded-full text-mist transition hover:bg-ink/5 hover:text-ink"
                              aria-label={`Remover ${product.name}`}
                            >
                              <Trash2 size={15} strokeWidth={1.4} />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center border border-ink/15">
                              <button
                                type="button"
                                className="grid h-9 w-9 place-items-center transition hover:bg-ink/5"
                                onClick={() => setQty(id, qty - 1)}
                                aria-label={`Diminuir quantidade de ${product.name}`}
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
                                {qty}
                              </span>
                              <button
                                type="button"
                                className="grid h-9 w-9 place-items-center transition hover:bg-ink/5 disabled:opacity-30"
                                onClick={() => setQty(id, qty + 1)}
                                disabled={qty >= 9}
                                aria-label={`Aumentar quantidade de ${product.name}`}
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <p className="text-sm font-semibold tabular-nums">{formatPrice(qty * product.price)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <footer className="border-t border-ink/10 px-6 pb-6 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow text-mist">Subtotal</span>
                    <span className="font-serif text-3xl tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-mist">Frete e embalagem calculados na finalização.</p>
                  <button
                    type="button"
                    onClick={() => setNotice(true)}
                    className="btn-luxe mt-5 w-full bg-ink text-ivory hover:bg-champagne hover:text-ink"
                  >
                    Finalizar compra
                  </button>
                  <AnimatePresence>
                    {notice && (
                      <motion.p
                        role="status"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 text-center text-xs leading-relaxed text-mist"
                      >
                        Esta é uma loja demonstrativa: o pagamento ainda não está integrado.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
