import { useState, type CSSProperties } from "react";
import { jewels, type JewelKey } from "../data/images";
import { cn } from "../lib/utils";

type Props = {
  name: JewelKey;
  /** `sizes` attribute so the browser picks the 640px or 1400px file */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  alt?: string;
};

/** Transparent jewel cut-out with responsive sources and a graceful fallback. */
export function JewelImage({ name, sizes = "50vw", className, style, priority, alt }: Props) {
  const asset = jewels[name];
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt ?? asset.alt}
        className={cn("flex aspect-square items-center justify-center", className)}
        style={style}
      >
        <span className="eyebrow text-current opacity-50">Imagem indisponível</span>
      </div>
    );
  }

  return (
    <img
      src={asset.src}
      srcSet={`${asset.srcSm} 640w, ${asset.src} ${asset.width}w`}
      sizes={sizes}
      width={asset.width}
      height={asset.height}
      alt={alt ?? asset.alt}
      loading={priority ? "eager" : "lazy"}
      // React 18 only knows the lowercase attribute
      {...{ fetchpriority: priority ? "high" : "auto" }}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={cn("h-auto max-w-full object-contain", className)}
      style={style}
    />
  );
}
