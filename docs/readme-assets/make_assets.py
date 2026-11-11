"""Regenerates the README images from the example card and the theme files.

Needs: python3, playwright (with Chromium), Pillow.
Run from the repo root:  python3 docs/readme-assets/make_assets.py

Note: when run offline the web fonts do not load, so headings use Lora as a stand-in.
Run it on a machine with network access and remove FONT_OVERRIDE to capture the real fonts.
"""
import glob, re, pathlib
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "assets" / "readme"
CARD = (ROOT / "examples" / "rajasthani-royal.html").as_uri()
FONT_OVERRIDE = "h1,h2,.amp{font-family:Lora,serif !important}"
STILL = "*{animation:none !important}"

def new_page(p, w, h, dsf):
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=dsf)
    pg.route("**/fonts.g*", lambda r: r.abort())
    return b, pg

def hero(p):
    b, pg = new_page(p, 390, 844, 2)
    pg.goto(CARD); pg.add_style_tag(content=STILL + FONT_OVERRIDE)
    pg.screenshot(path=str(OUT / "card.png"), full_page=True)
    b.close()

def build_gif(p):
    b, pg = new_page(p, 390, 800, 1)
    pg.goto(CARD); pg.add_style_tag(content=STILL + FONT_OVERRIDE)
    pg.add_style_tag(content=".frame>*{visibility:hidden}")
    n = pg.evaluate("document.querySelector('.frame').children.length")
    steps = [0, 2, 5, 7, 9, n]
    frames = []
    for k in steps:
        pg.evaluate("k=>[...document.querySelector('.frame').children].forEach((c,i)=>c.style.visibility=i<k?'visible':'hidden')", k)
        pg.screenshot(path="/tmp/f.png", full_page=True)
        frames.append(Image.open("/tmp/f.png").convert("RGB").copy())
    b.close()
    h = max(f.height for f in frames)
    frames = [f if f.height == h else f.resize((f.width, h)) for f in frames]
    seq, dur = [], []
    for i, f in enumerate(frames):
        seq.append(f); dur.append(900 if i < len(frames) - 1 else 3000)
        if i < len(frames) - 1:
            for t in (0.33, 0.66):
                seq.append(Image.blend(f, frames[i + 1], t)); dur.append(70)
    pal = [im.quantize(colors=96, method=Image.Quantize.MEDIANCUT) for im in seq]
    pal[0].save(OUT / "demo.gif", save_all=True, append_images=pal[1:], duration=dur, loop=0, optimize=True, disposal=2)

def themes(p):
    cards = []
    for f in sorted(glob.glob(str(ROOT / "skills/wedding-invitation/references/themes/*.md"))):
        t = pathlib.Path(f).read_text()
        name = re.search(r"^# (.+)$", t, re.M).group(1)
        fits = re.search(r"\*\*Fits:\*\* (.+)", t).group(1)
        pal = re.search(r"\*\*Palette:\*\* (.+)", t).group(1)
        hexes = list(dict.fromkeys(re.findall(r"#[0-9A-Fa-f]{6}", pal)))[:5]
        sw = "".join(f'<i style="background:{h}"></i>' for h in hexes)
        cards.append(f'<div class="c"><div class="sw">{sw}</div><h3>{name}</h3><p>{fits}</p></div>')
    html = f"""<style>body{{margin:0;padding:28px;background:#FFF6E5;font:14px/1.45 Lora,serif;color:#3B1F12;width:1144px}}
    .g{{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}}.c{{background:#fff;border:1px solid #e6d3a8;border-radius:10px;overflow:hidden}}
    .sw{{display:flex;height:64px}}.sw i{{flex:1}}h3{{margin:12px 14px 2px;font:600 17px Lora,serif;color:#B0124F}}p{{margin:0 14px 14px;font-size:13px}}</style>
    <div class="g">{''.join(cards)}</div>"""
    b, pg = new_page(p, 1200, 600, 1)
    pg.set_content(html); pg.screenshot(path=str(OUT / "themes.png"), full_page=True); b.close()

with sync_playwright() as p:
    hero(p); build_gif(p); themes(p)
print("assets written to", OUT)
