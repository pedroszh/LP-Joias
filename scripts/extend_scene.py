"""Bake the stone-carousel backgrounds into single full-frame images.

The jewel photographs are close to square; the carousel needs 16:9 (desktop) and
9:16 (phones). Instead of blurring the photo live in the browser (expensive while
scrolling), each side is extended once here by stretching the photo's own outer
strip and feathering the seam, then saved as a light WebP.

    python scripts/extend_scene.py
"""
from PIL import Image, ImageFilter, ImageDraw

SCENES = [("Anel-fundo.png", "esmeralda"), ("Pingente-fundo.png", "safira"), ("pulseira-fundo.png", "ametista")]
OUT = "src/assets/jewels/"


def feather_mask(size, axis, width):
    """Opaque centre, soft edges along the extension axis."""
    w, h = size
    m = Image.new("L", size, 255)
    d = ImageDraw.Draw(m)
    for i in range(width):
        v = int(255 * (i / width) ** 1.4)
        if axis == "x":
            d.line([(i, 0), (i, h)], fill=v)
            d.line([(w - 1 - i, 0), (w - 1 - i, h)], fill=v)
        else:
            d.line([(0, i), (w, i)], fill=v)
            d.line([(0, h - 1 - i), (w, h - 1 - i)], fill=v)
    return m


def extend(photo, W, H, axis):
    canvas = Image.new("RGB", (W, H))
    ph = photo.copy()
    if axis == "x":
        ph.thumbnail((10_000, H), Image.LANCZOS)
        pad = (W - ph.width) // 2
        strip = max(8, ph.width // 40)
        left = ph.crop((0, 0, strip, ph.height)).resize((pad + 170, ph.height), Image.BICUBIC)
        right = ph.crop((ph.width - strip, 0, ph.width, ph.height)).resize((W - pad - ph.width + 170, ph.height), Image.BICUBIC)
        canvas.paste(left.filter(ImageFilter.GaussianBlur(6)), (0, 0))
        canvas.paste(right.filter(ImageFilter.GaussianBlur(6)), (pad + ph.width - 170, 0))
        canvas.paste(ph, (pad, 0), feather_mask(ph.size, "x", min(140, pad)))
    else:
        ph.thumbnail((W, 10_000), Image.LANCZOS)
        pad = (H - ph.height) // 2
        strip = max(8, ph.height // 40)
        top = ph.crop((0, 0, ph.width, strip)).resize((ph.width, pad + 170), Image.BICUBIC)
        bottom = ph.crop((0, ph.height - strip, ph.width, ph.height)).resize((ph.width, H - pad - ph.height + 170), Image.BICUBIC)
        canvas.paste(top.filter(ImageFilter.GaussianBlur(6)), (0, 0))
        canvas.paste(bottom.filter(ImageFilter.GaussianBlur(6)), (0, pad + ph.height - 170))
        canvas.paste(ph, (0, pad), feather_mask(ph.size, "y", min(140, pad)))
    return canvas


for src, name in SCENES:
    photo = Image.open(src).convert("RGB")
    wide = extend(photo, 1920, 1080, "x")
    wide.save(f"{OUT}cena-{name}-wide.webp", "WEBP", quality=82, method=6)
    tall = extend(photo, 1080, 1920, "y")
    tall.save(f"{OUT}cena-{name}-tall.webp", "WEBP", quality=80, method=6)
    print(name, "ok")
