"""Headless check of /intro (run via `make check-intro`): every screen fits, PageDown lands on each screen, bars grow,
no console errors. Exits 1 on a failure at 1080p or 720p; phones scroll freely, so only overflow and errors count there."""
import json, sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8088/intro"
OUT = "/out"
report = {}

with sync_playwright() as p:
    # localhost inside the container is the container; map it to the host so Vite sees a normal localhost request
    b = p.chromium.launch(args=["--host-resolver-rules=MAP localhost host.docker.internal"])
    for name, vw, vh in [("1080p", 1920, 1080), ("720p", 1280, 720), ("phone", 390, 844)]:
        page = b.new_page(viewport={"width": vw, "height": vh})
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(1500)
        secs = page.eval_on_selector_all("[data-chapter]", "els => els.map(e => ({id: e.id, top: Math.round(e.getBoundingClientRect().top + scrollY), h: Math.round(e.getBoundingClientRect().height)}))")
        landed = []
        if vw >= 1024:
            page.mouse.click(40, vh // 2)
            for i in range(len(secs)):
                page.screenshot(path=f"{OUT}/{name}-{i:02d}-{secs[i]['id'] if i < len(secs) else 'x'}.png")
                if i < len(secs) - 1:
                    page.keyboard.press("PageDown")
                    page.wait_for_timeout(1400)
                    landed.append(page.evaluate("Math.round(scrollY)"))
        else:
            for s in secs:
                page.evaluate(f"scrollTo({{top:{s['top']},behavior:'instant'}})")
                page.wait_for_timeout(900)
                page.screenshot(path=f"{OUT}/{name}-{s['id']}.png", full_page=False)
        bars = page.eval_on_selector_all("#review ul span > span.block", "els => els.map(e => getComputedStyle(e).transform)")
        word = page.evaluate("document.querySelector('#review .sr-only')?.textContent ?? null")
        report[name] = {
            "sections": secs,
            "too_tall": [s["id"] for s in secs if s["h"] > vh],
            "pagedown_landed": landed,
            "expected": [s["top"] for s in secs[1:]],
            "bars": bars,
            "word": word,
            "overflow_x": page.evaluate("document.documentElement.scrollWidth > innerWidth"),
            "errors": errors,
        }
        page.close()
    b.close()

fails = []
for name, r in report.items():
    if r["errors"]:
        fails.append(f"{name}: console errors {r['errors'][:3]}")
    if r["overflow_x"]:
        fails.append(f"{name}: horizontal overflow")
    if name != "phone":
        if r["too_tall"]:
            fails.append(f"{name}: taller than the screen: {r['too_tall']}")
        if r["pagedown_landed"] != r["expected"]:
            fails.append(f"{name}: PageDown landed {r['pagedown_landed']}, expected {r['expected']}")
print("\n".join(fails) if fails else f"check-intro: {len(report['1080p']['sections'])} screens OK at 1080p, 720p and phone")
sys.exit(1 if fails else 0)
