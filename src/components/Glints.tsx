import { cn } from "../lib/utils";

type Glint = { x: string; y: string; size: number; delay: number };

const DEFAULT: Glint[] = [
  { x: "22%", y: "30%", size: 18, delay: 0 },
  { x: "71%", y: "22%", size: 12, delay: 1.1 },
  { x: "64%", y: "68%", size: 22, delay: 2.2 },
  { x: "35%", y: "74%", size: 10, delay: 0.6 },
  { x: "82%", y: "48%", size: 14, delay: 1.7 },
];

/** Four-point light flares that twinkle around a jewel. Pure CSS, decorative. */
export function Glints({ glints = DEFAULT, className, color = "#fff" }: { glints?: Glint[]; className?: string; color?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {glints.map((g, i) => (
        <span
          key={i}
          className="animate-glint absolute"
          style={{ left: g.x, top: g.y, width: g.size, height: g.size, animationDelay: `${g.delay}s` }}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
            <path d="M12 0 C12.6 8 16 11.4 24 12 C16 12.6 12.6 16 12 24 C11.4 16 8 12.6 0 12 C8 11.4 11.4 8 12 0Z" fill={color} />
          </svg>
        </span>
      ))}
    </div>
  );
}
