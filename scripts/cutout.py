"""Remove the white studio background from the jewel photos and export
transparent WebP files (plus colour variants) for the site."""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)


def cutout(path):
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    h, w, _ = im.shape
    mn = im.min(axis=2)
    mx = im.max(axis=2)
    near_white = (mn > 228) & ((mx - mn) < 22)
    lab, n = ndimage.label(near_white)
    sizes = ndimage.sum(near_white, lab, range(1, n + 1))
    big = np.zeros(n + 1, bool)
    big[1:] = sizes > (h * w * 0.004)  # small white islands = diamonds/highlights
    bg = big[lab]
    band = ndimage.binary_dilation(bg, iterations=3) & ~bg
    # soft alpha in the edge band based on distance from white
    soft = np.clip((252 - mn) / 70.0, 0, 1)
    alpha = np.ones((h, w), np.float32)
    alpha[bg] = 0
    alpha[band] = soft[band]
    alpha = ndimage.gaussian_filter(alpha, 0.6)
    alpha[bg & ~ndimage.binary_dilation(~bg, iterations=1)] = 0
    # un-premultiply from white
    a = np.clip(alpha, 1e-3, 1)[..., None]
    rgb = np.clip((im - (1 - a) * 255) / a, 0, 255)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    ys, xs = np.where(alpha > 0.02)
    pad = 24
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, h)
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, w)
    return Image.fromarray(out[y0:y1, x0:x1], "RGBA")


def hue_shift(img, src_range, target_hue, sat_mul=1.0, val_mul=1.0):
    """Recolour only the gemstone (pixels whose hue sits inside src_range)."""
    rgba = np.asarray(img).copy()
    hsv = np.asarray(img.convert("RGB").convert("HSV")).astype(np.float32)
    hdeg = hsv[..., 0] * 360 / 255
    lo, hi = src_range
    m = (hdeg >= lo) & (hdeg <= hi) & (hsv[..., 1] > 40)
    w = ndimage.gaussian_filter(m.astype(np.float32), 1.0)
    new = hsv.copy()
    new[..., 0] = target_hue * 255 / 360
    new[..., 1] = np.clip(hsv[..., 1] * sat_mul, 0, 255)
    new[..., 2] = np.clip(hsv[..., 2] * val_mul, 0, 255)
    new_rgb = np.asarray(Image.fromarray(new.astype(np.uint8), "HSV").convert("RGB")).astype(np.float32)
    old_rgb = rgba[..., :3].astype(np.float32)
    mix = old_rgb * (1 - w[..., None]) + new_rgb * w[..., None]
    rgba[..., :3] = mix.astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def save(img, name, max_side=1400):
    img = img.copy()
    img.thumbnail((max_side, max_side), Image.LANCZOS)
    img.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=88, method=6)
    small = img.copy()
    small.thumbnail((640, 640), Image.LANCZOS)
    small.save(os.path.join(OUT, name + "-sm.webp"), "WEBP", quality=85, method=6)
    print(name, img.size)


ring = cutout(os.path.join(SRC, "anel-esmeralda.png"))
pendant = cutout(os.path.join(SRC, "Pingente.png"))
bracelet = cutout(os.path.join(SRC, "Pulseira.png"))

save(ring, "anel-esmeralda")
save(pendant, "colar-safira")
save(bracelet, "pulseira-ametista")

# full-scene photos (jewel already staged on a background) for the stone carousel
for src_name, out_name in [
    ("Anel-fundo.png", "cena-esmeralda"),
    ("Pingente-fundo.png", "cena-safira"),
    ("pulseira-fundo.png", "cena-ametista"),
]:
    path = os.path.join(SRC, src_name)
    if os.path.exists(path):
        photo = Image.open(path).convert("RGB")
        photo.save(os.path.join(OUT, out_name + ".webp"), "WEBP", quality=86, method=6)
        sm = photo.copy()
        sm.thumbnail((760, 760), Image.LANCZOS)
        sm.save(os.path.join(OUT, out_name + "-sm.webp"), "WEBP", quality=82, method=6)
        print(out_name, photo.size)
