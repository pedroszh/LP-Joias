import sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

src, out_png, preview = sys.argv[1], sys.argv[2], sys.argv[3]
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
h, w, _ = im.shape
R, G, B = im[..., 0], im[..., 1], im[..., 2]
gold = R - B  # warmth: polished gold is far warmer than the satin around it

# satin estimate: remove thin structures (the chain) with a large median
bg = ndimage.median_filter(gold, size=35)
lum = im.mean(2)
lum_bg = ndimage.median_filter(lum, size=35)
# link edges: strong local detail (satin glitter is much fainter)
detail = ndimage.gaussian_filter(np.abs(lum - ndimage.gaussian_filter(lum, 3)), 2.5)
d = (gold - bg) + 0.35 * np.abs(lum - lum_bg) + 0.9 * np.clip(detail - 6, 0, None)
alpha = np.clip((d - 13) / 24, 0, 1)

# drop speckle from the satin's glitter texture
m = alpha > 0.35
lab, n = ndimage.label(m)
sizes = ndimage.sum(m, lab, range(1, n + 1))
keep = np.zeros(n + 1, bool)
keep[1:] = sizes > 700
alpha *= ndimage.binary_dilation(keep[lab], iterations=3)

# pendant (bail + heart): solid shape drawn by hand
poly = Image.new("L", (w, h), 0)
dr = ImageDraw.Draw(poly)
bail = [(565, 570), (605, 565), (652, 580), (640, 625), (625, 670), (618, 705), (632, 715), (635, 738), (605, 741), (575, 738), (572, 712), (582, 700), (575, 655), (568, 610)]
heart = [(590, 756), (575, 742), (545, 735), (515, 738), (495, 740), (485, 760), (481, 790), (482, 820), (490, 850), (505, 880), (530, 910), (555, 935), (574, 953), (590, 946), (630, 935), (660, 911), (685, 881), (698, 840), (701, 800), (698, 768), (688, 755), (675, 748), (650, 741), (630, 745), (610, 752)]
dr.polygon(bail, fill=255)
dr.polygon(heart, fill=255)
poly = ndimage.gaussian_filter(np.asarray(poly).astype(np.float32) / 255, 1.2)
alpha = np.maximum(alpha, poly)
alpha = ndimage.gaussian_filter(alpha, 0.7)

out = np.dstack([im, alpha * 255]).astype(np.uint8)
Image.fromarray(out, "RGBA").save(out_png)

# preview on dark + ivory to judge edges
pv = Image.new("RGB", (w * 2, h), (20, 18, 16))
pv.paste((245, 240, 232), (w, 0, w * 2, h))
o = Image.fromarray(out, "RGBA")
pv.paste(o, (0, 0), o)
pv.paste(o, (w, 0), o)
pv.thumbnail((1600, 900))
pv.save(preview)
