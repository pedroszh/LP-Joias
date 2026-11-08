import { useCallback, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Mail, MapPin, Phone, X } from "lucide-react";
import { Logo } from "../components/Logo";
import { NAV } from "../components/Header";
import { useOverlay } from "../lib/useLockBody";
import { EASE, storage } from "../lib/utils";

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const closePrivacy = useCallback(() => setPrivacyOpen(false), []);
  useOverlay(privacyOpen, closePrivacy);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      return;
    }
    // no backend yet: keep it locally so the form can be wired to an API later
    storage.set("vellare:newsletter", { email: email.trim(), at: Date.now() });
    setStatus("done");
    setEmail("");
  };

  return (
    <footer id="contato" className="relative overflow-hidden bg-ink text-ivory">
      <div className="container-luxe grid gap-16 pb-16 pt-24 lg:grid-cols-12 lg:pt-32">
        <div className="lg:col-span-5">
          <p className="eyebrow text-champagne">Lista Vellaré</p>
          <h2 className="display mt-5 text-[clamp(2.4rem,5vw,4.4rem)]">
            Seja a primeira a <em className="text-champagne-light">sentir o brilho.</em>
          </h2>
          <form onSubmit={submit} noValidate className="mt-9 max-w-md">
            <label htmlFor="newsletter" className="sr-only">
              Seu e-mail
            </label>
            <div className="flex items-center border-b border-ivory/25 transition focus-within:border-champagne">
              <input
                id="newsletter"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                aria-invalid={status === "error"}
                aria-describedby="newsletter-msg"
                className="min-h-12 flex-1 bg-transparent text-base outline-none placeholder:text-ivory/30"
              />
              <button
                type="submit"
                className="grid h-12 w-12 place-items-center text-champagne transition hover:translate-x-1"
                aria-label="Inscrever-se"
              >
                <ArrowRight size={20} strokeWidth={1.4} />
              </button>
            </div>
            <p id="newsletter-msg" className="mt-3 min-h-5 text-xs" aria-live="polite">
              {status === "error" && <span className="text-[#f0a8a8]">Digite um e-mail válido.</span>}
              {status === "done" && (
                <span className="inline-flex items-center gap-2 text-champagne-light">
                  <Check size={13} /> Inscrição registrada. Obrigado!
                </span>
              )}
              {status === "idle" && <span className="text-ivory/40">Lançamentos e convites, sem excessos.</span>}
            </p>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
          <div>
            <p className="eyebrow text-ivory/40">Navegação</p>
            <ul className="mt-5 space-y-3">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="link-underline text-sm text-ivory/80 hover:text-ivory">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#vitrine" className="link-underline text-sm text-ivory/80 hover:text-ivory">
                  Vitrine
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-ivory/40">Contato</p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/80">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-champagne" />
                <a href="mailto:contato@vellare.example" className="link-underline break-all">
                  contato@vellare.example
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-champagne" /> (11) 0000-0000
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-champagne" /> São Paulo · Atendimento com hora marcada
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-ivory/40">Redes</p>
            <ul className="mt-5 space-y-3">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline text-sm text-ivory/80 hover:text-ivory"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="container-luxe flex flex-col gap-4 border-t border-ivory/10 py-6 text-xs text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
        <Logo className="items-start text-ivory/80 sm:items-center" />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <button type="button" onClick={() => setPrivacyOpen(true)} className="link-underline min-h-9 hover:text-ivory">
            Política de privacidade
          </button>
          <span>© {new Date().getFullYear()} Vellaré. Marca conceitual. Todos os direitos reservados.</span>
        </div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none select-none bg-gradient-to-b from-champagne/50 to-champagne/5 bg-clip-text text-center font-serif text-[25vw] font-light leading-[0.75] tracking-[-0.04em] text-transparent"
      >
        Vellaré
      </p>

      <AnimatePresence>
        {privacyOpen && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePrivacy}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="privacy-title"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85svh] w-full max-w-lg overflow-y-auto bg-ivory p-8 text-ink"
            >
              <button
                type="button"
                autoFocus
                onClick={closePrivacy}
                aria-label="Fechar política de privacidade"
                className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5"
              >
                <X size={18} />
              </button>
              <p className="eyebrow text-champagne-deep">Privacidade</p>
              <h2 id="privacy-title" className="display mt-3 text-4xl">
                Política de privacidade
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-mist">
                <p>
                  Este site é uma demonstração. Nenhum dado é enviado a servidores: a sacola, os favoritos e a inscrição
                  na newsletter ficam armazenados apenas no seu navegador.
                </p>
                <p>
                  Você pode apagar essas informações a qualquer momento limpando os dados do site nas configurações do
                  seu navegador.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
