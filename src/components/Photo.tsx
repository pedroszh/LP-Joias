import { useState, type CSSProperties } from "react";
import { photos, type PhotoKey } from "../data/photos";
import { cn } from "../lib/utils";

type Props = {
  name: PhotoKey;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  alt?: string;
};

/** Full-bleed photograph (object-cover) with responsive sources and a quiet fallback. */
export function Photo({ name, sizes = "50vw", className, style, priority, alt }: Props) {
  const asset = photos[name];
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div role="img" aria-label={alt ?? asset.alt} className={cn("bg-sand", className)} style={style} />
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
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
      style={style}
    />
  );
}
