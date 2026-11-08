"""Render the brand film (silent, looping) from the site's own photography.

Each still gets a slow Ken Burns move; stills cross-dissolve into each other and the
last one dissolves back into the first so the clip loops seamlessly. Outputs a
landscape cut (desktop) and a portrait cut (phones) plus poster frames.

    python scripts/brand_film.py <photos-dir>
"""
import os
import subprocess
import sys

from PIL import Image, ImageEnhance

SRC = sys.argv[1]  # folder with the full-resolution stills
OUT = "src/assets/video/"
FPS = 24
HOLD, FADE = 3.4, 1.0  # seconds each shot is fully visible / dissolve length

# (file, landscape-friendly file, zoom direction, pan focus x, pan focus y)
SHOTS = [
    ("cena-esmeralda-tall.webp", "cena-esmeralda-wide.webp", 1, 0.5, 0.45),
    ("editorial-orelha.png", "editorial-orelha.png", -1, 0.48, 0.32),
    ("cena-safira-tall.webp", "cena-safira-wide.webp", 1, 0.5, 0.55),
    ("editorial-relogio-v2.png", "editorial-relogio-v2.png", -1, 0.72, 0.55),
    ("Colar-dourado.png", "Colar-dourado.png", 1, 0.5, 0.62),
    ("cena-ametista-tall.webp", "cena-ametista-wide.webp", -1, 0.45, 0.55),
    ("editorial-mao.png", "editorial-mao.png", 1, 0.45, 0.58),
]


def cover(img, W, H, fx, fy):
    """Scale to cover W×H, keeping the focus point as central as the crop allows."""
    s = max(W / img.width, H / img.height)
    w, h = int(img.width * s + 0.5), int(img.height * s + 0.5)
    img = img.resize((w, h), Image.LANCZOS)
    x = min(max(int(fx * w - W / 2), 0), w - W)
    y = min(max(int(fy * h - H / 2), 0), h - H)
    return img.crop((x, y, x + W, y + H))


def grade(img):
    """Gentle warm, slightly lifted film look so every shot reads as one campaign."""
    img = ImageEnhance.Contrast(img).enhance(1.04)
    img = ImageEnhance.Color(img).enhance(0.96)
    r, g, b = img.split()
    r = r.point(lambda v: min(255, int(v * 1.02 + 2)))
    b = b.point(lambda v: int(v * 0.97))
    return Image.merge("RGB", (r, g, b))


def render(W, H, portrait, out_name):
    base = []
    for tall, wide, zdir, fx, fy in SHOTS:
        path = os.path.join(SRC, tall if portrait else wide)
        img = Image.open(path).convert("RGB")
        # oversize by the max zoom so the move never reveals an edge
        base.append((grade(cover(img, int(W * 1.1), int(H * 1.1), fx, fy)), zdir))

    shot_len = HOLD + FADE
    total = shot_len * len(SHOTS)
    n = int(total * FPS)

    def frame_of(i, t):
        img, zdir = base[i % len(base)]
        p = min(1.0, max(0.0, t / (shot_len + FADE)))
        z = 1.0 + 0.08 * (p if zdir > 0 else 1 - p)  # 1.00 → 1.08 (or reverse)
        cw, ch = int(img.width / z), int(img.height / z)
        x, y = (img.width - cw) // 2, (img.height - ch) // 2
        return img.crop((x, y, x + cw, y + ch)).resize((W, H), Image.BICUBIC)

    proc = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "26", "-preset", "slow", "-tune", "film",
         "-movflags", "+faststart", "-an", OUT + out_name + ".mp4"],
        stdin=subprocess.PIPE,
    )
    for f in range(n):
        t = f / FPS
        i = int(t // shot_len)
        local = t - i * shot_len
        cur = frame_of(i, local + FADE)
        if local < FADE:  # dissolve from the previous shot (shot 0 dissolves from the last → seamless loop)
            prev = frame_of(i - 1, local + FADE + shot_len)
            a = local / FADE
            a = a * a * (3 - 2 * a)
            cur = Image.blend(prev, cur, a)
        proc.stdin.write(cur.tobytes())
        if f == int(FPS * (FADE + 0.5)):
            cur.save(OUT + out_name + "-poster.webp", "WEBP", quality=80)
    proc.stdin.close()
    proc.wait()
    print(out_name, f"{W}x{H}", f"{total:.1f}s")


os.makedirs(OUT, exist_ok=True)
render(1600, 900, False, "filme-lumiere")
render(720, 1280, True, "filme-lumiere-vertical")
