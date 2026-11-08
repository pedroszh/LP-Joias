import { cn } from "../lib/utils";

export function Logo({ className, tagline = false }: { className?: string; tagline?: boolean }) {
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <span className="font-serif text-[1.65rem] font-medium tracking-[0.34em] pl-[0.34em]">VELLARÉ</span>
      {tagline && (
        <span className="mt-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.5em] pl-[0.5em] opacity-70">
          Haute Joaillerie
        </span>
      )}
    </span>
  );
}
