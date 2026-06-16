---
title: "Mining Google Maps Reviews for Unmet Customer Demand"
description: "A JupyterLab workflow for extracting Google Maps reviews, filtering for causally useful customer experience signals, and turning local competitor reviews into unmet-demand analysis."
date: "2026-06-16"
tags:
  - data-analysis
  - audience-resonance
  - google maps
  - llm-analysis
  - audience-behaviour
  - identity-construction
  - python
  - strategic-positioning

---

# Mining Google Maps Reviews for Unmet Customer Demand

[View the notebook on GitHub](https://github.com/arh789/google_maps_reviews)

The most useful reviews are not always the angriest ones.

Five-star reviews show what already works. One- and two-star reviews show serious failure or customer-business mismatch. But three- and four-star reviews are an interesting case. Fundamentally, they are positive reviews, yet they are still not five stars. Something was missing. 

They are the reviews where the customer's demands were met, where they got what they paid for, and received  what the business promised, but in spite of this, for some reason, probably won't go back. The customer got what they paid for, but not enough to care.

Three and four star reviews are the unmet demand, that when properly identified, can lend serious advantage in a competitive business landscape. 

Most local competitor analysis stops too early.

It can show where competitors are located. It can show how many businesses exist in a suburb, street, or search category. It can scrape names, addresses, websites, ratings, and sometimes review counts. That is useful, but it mostly describes the supply side of the market.

It tells you where businesses are.

It does not automatically tell you where unmet need still exists. This information is invaluable for business positioning, designing new products or services, or simply realising that your own business already meets this demand, but you haven't yet highlighted it properly. 

That is the gap this notebook is designed to address.

The workflow uses Google Maps as a local-market discovery layer, then extracts reviews from a small set of businesses, filters those reviews for causally useful information, and uses an LLM to convert customer language into operational signals: journey friction, expectation mismatches, staff interactions, constraints, recovery failures, satisfaction patterns, persona cues, and unmet demand.

The goal is not to produce a generic sentiment summary. The goal is to move from competitor mapping to demand mapping.

```text
competitor locations
→ reviews
→ causal customer-experience signals
→ journey failures
→ unmet demand
→ local positioning opportunities
```

## The business demand this notebook meets

A local business does not only need to know who its competitors are.

It needs to know:

- what customers expected before choosing a business
- what happened during the service experience
- which parts of the journey created friction
- what customers praise when the experience succeeds
- what customers complain about when the experience fails
- whether poor reviews reveal isolated mistakes or repeated unmet demand
- how the local market can still be entered, differentiated, or repositioned

This matters because competitor density alone is ambiguous.

A suburb can be dense with cafés, dentists, tattoo studios, gyms, mechanics, or clinics and still contain unmet demand. The opportunity is not always “there are not enough competitors”. Sometimes the opportunity is “there are enough competitors, but they are failing customers in the same repeated ways”.

That is the strategic difference.

```text
Competitor density shows where supply exists.
Review-derived journey mapping shows where the market is still failing.
```

This notebook is a small working prototype of that idea.

## What the workflow produces

The notebook produces one CSV file:

```text
reviews.csv
```

The file contains all causally useful reviews, including the rating, review text, extracted causal atoms, confidence, and persona cues.

The ratings are preserved in one file so the analysis can compare patterns across one-star, two-star, three-star, four-star, and five-star reviews inside a single dataset. The useful comparison is:

```text
what exists across all review ratings
what exists only in successful experiences
what exists only in failed or compromised experiences
what journey map is implied by both
what demand remains unmet
```

## Important note before publishing or running this

This is a research notebook. Google Maps pages, selectors, scroll behaviour, and review markup can change. Scraping can also be constrained by site terms, permissions, rate limits, and local rules. Treat the notebook as a workflow demonstration and adapt it responsibly for your own environment.

## Full notebook code and workflow


## 1. Setup: imports, timing, search target, and limits

The notebook starts with imports, a start timestamp, the local search term, and small limits for testing. In the version inspected here, the target query is `coffee shop enmore`, with three businesses and five reviews per business.

```python
# --- Notebook code cell 0 ---
from playwright.async_api import async_playwright, Page, TimeoutError as PWTimeoutError 
import re
import time
from datetime import date, datetime, timedelta
import pandas as pd
from IPython.display import clear_output
from collections import deque
import openai
from openai import OpenAI
import json
from IPython.display import clear_output
from collections import deque
import matplotlib.pyplot as plt
from pathlib import Path
import os

# --- Notebook code cell 1 ---
start_time = datetime.now()

print(datetime.now().strftime('%Y-%m-%d %H:%M'))

# --- Notebook code cell 2 ---
SEARCH_TERM = "coffee shop enmore"

# --- Notebook code cell 3 ---
MAX_BUSINESSES = 3

# --- Notebook code cell 4 ---
MAX_REVIEWS = 5

# --- Notebook code cell 5 ---
SEARCH_URL = f"https://www.google.com/maps/search/{SEARCH_TERM.replace(' ', '+')}/"
```

## 2. Progress tracking and the Windows/Jupyter Playwright wrapper

The progress tracker keeps long scraping and model calls visible inside Jupyter. The `run_playwright_async` wrapper runs Playwright inside a separate event loop/thread, which is important when Jupyter, Windows, and Playwright are fighting over async event-loop behaviour.

```python
# --- Notebook code cell 6 ---
def make_progress_tracker(maxlen=5):
    last_time = time.time()
    updates = deque(maxlen=maxlen)

    def tick(i):
        nonlocal last_time
        now = time.time()
        elapsed = now - last_time
        last_time = now

        updates.append((i, elapsed))

        clear_output(wait=True)
        print(f"Recent progress (last {maxlen}):\n")
        for idx, t in updates:
            print(f"Processed: {idx} | Δt: {t:.1f}s")

    return tick

tick = make_progress_tracker(maxlen=5)

# --- Notebook code cell 7 ---
import asyncio, sys, threading

def run_playwright_async(fn, *args, **kwargs):
    box = {}

    def runner():
        loop = asyncio.ProactorEventLoop() if sys.platform.startswith("win") else asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            box["result"] = loop.run_until_complete(fn(*args, **kwargs))
        except BaseException as e:
            box["error"] = e
        finally:
            loop.close()

    t = threading.Thread(target=runner)
    t.start()
    t.join()

    if "error" in box:
        raise box["error"]

    return box["result"]
```

## 3. Business discovery from Google Maps

This section opens the Google Maps search URL, scrolls the result feed, opens business cards, extracts the place URL, address, and website URL, then deduplicates results by address and website.

```python
# --- Notebook code cell 8 ---
n_businesses = 0

async def collect_business_list(search_url, max_businesses=10, headless=False):
    global n_businesses

    from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

    def normalise_website_url(href: str | None) -> str | None:
        if not href:
            return None
        parts = urlsplit(href)
        qs = parse_qsl(parts.query, keep_blank_values=True)
        drop_keys = {
            "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
            "gclid", "fbclid", "dclid", "gbraid", "wbraid"
        }
        qs2 = [(k, v) for (k, v) in qs if k.lower() not in drop_keys]
        query2 = urlencode(qs2, doseq=True)
        return urlunsplit((parts.scheme, parts.netloc, parts.path, query2, parts.fragment))

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless)
        context = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await context.new_page()

        await page.goto(search_url, timeout=90000, wait_until="domcontentloaded")
        await page.wait_for_selector('div[role="feed"] div[role="article"]', timeout=90000)

        feed = page.locator('div[role="feed"]').first

        prev, stagnation = 0, 0
        while True:
            cards = page.locator('div[role="feed"] div[role="article"]')
            count = await cards.count()

            if count >= max_businesses:
                break

            if count == prev:
                stagnation += 1
                if stagnation >= 8:
                    break
            else:
                prev, stagnation = count, 0

            await feed.evaluate("(el) => el.scrollBy(0, Math.max(300, el.clientHeight * 0.85))")
            await page.wait_for_timeout(900)

        async def open_place_from_card(index, max_tries=5):
            for _ in range(max_tries):
                cards_local = page.locator('div[role="feed"] div[role="article"]')
                if await cards_local.count() <= index:
                    return False

                card = cards_local.nth(index)

                await card.scroll_into_view_if_needed()
                await page.wait_for_timeout(150)

                await card.click(timeout=8000)

                deadline = time.monotonic() + 25
                while time.monotonic() < deadline:
                    if await page.locator('button[data-item-id="address"], button[aria-label^="Address:"]').count() > 0:
                        return True
                    if await page.locator('a[data-item-id="authority"], a[aria-label^="Website:"]').count() > 0:
                        return True

                    if await page.locator("h1").first.count() > 0:
                        if await page.locator(
                            'button[data-item-id="address"], button[aria-label^="Address:"], a[data-item-id="authority"], a[aria-label^="Website:"]'
                        ).count() > 0:
                            return True

                    await page.wait_for_timeout(200)

                await page.keyboard.press("Escape")
                await page.wait_for_timeout(250)

            return False

        async def get_place_url_from_panel():
            cur = page.url or ""
            if "/maps/place/" in cur:
                return cur

            a = page.locator('a[href*="/maps/place/"]').first
            if await a.count() > 0:
                href = await a.get_attribute("href")
                if href and "/maps/place/" in href:
                    return href

            m = page.locator('meta[itemprop="url"]').first
            if await m.count() > 0:
                content = await m.get_attribute("content")
                if content and "/maps/place/" in content:
                    return content

            canon = page.locator('link[rel="canonical"]').first
            if await canon.count() > 0:
                href = await canon.get_attribute("href")
                if href and "/maps/place/" in href:
                    return href

            og = page.locator('meta[property="og:url"]').first
            if await og.count() > 0:
                content = await og.get_attribute("content")
                if content and "/maps/place/" in content:
                    return content

            raise RuntimeError("FAILED to find canonical /maps/place/ url")

        async def get_address_text():
            loc = page.locator('button[data-item-id="address"] .Io6YTe').first
            if await loc.count() > 0:
                txt = (await loc.inner_text()).strip()
                if txt:
                    return txt

            b = page.locator('button[data-item-id="address"]').first
            if await b.count() > 0:
                lab = await b.get_attribute("aria-label")
                if lab:
                    lab = lab.strip()
                    if lab.lower().startswith("address:"):
                        lab = lab.split(":", 1)[1].strip()
                    if lab:
                        return lab

            b1 = page.locator('button[aria-label^="Address"]').first
            if await b1.count() > 0:
                lab = await b1.get_attribute("aria-label")
                if lab:
                    lab = lab.strip()
                    if lab.lower().startswith("address:"):
                        lab = lab.split(":", 1)[1].strip()
                    return lab or None

            b2 = page.locator('button[aria-label^="Copy address"]').first
            if await b2.count() > 0:
                lab = await b2.get_attribute("aria-label")
                if lab:
                    lab = lab.strip()
                    if lab.lower().startswith("address:"):
                        lab = lab.split(":", 1)[1].strip()
                    return lab or None

            return None

        business_rows = []

        cards = page.locator('div[role="feed"] div[role="article"]')
        total = min(await cards.count(), max_businesses)

        for i in range(total):
            ok = await open_place_from_card(i, max_tries=5)
            if not ok:
                continue

            n_businesses += 1
            tick(n_businesses)

            place_url = await get_place_url_from_panel()
            address = await get_address_text()

            website_url = None
            w = page.locator('a[data-item-id="authority"]').first
            if await w.count() > 0:
                website_url = await w.get_attribute("href")

            if not website_url:
                w2 = page.locator('a[aria-label^="Website:"]').first
                if await w2.count() > 0:
                    website_url = await w2.get_attribute("href")

            website_url = normalise_website_url(website_url)

            business_rows.append(
                {
                    "place_url": place_url,
                    "address": address,
                    "website_url": website_url,
                }
            )

            await page.keyboard.press("Escape")
            await page.wait_for_timeout(180)
            await page.keyboard.press("Escape")
            await page.wait_for_timeout(280)

        await context.close()
        await browser.close()

        df = pd.DataFrame(business_rows)
        if not df.empty:
            df = df.drop_duplicates(subset=["place_url", "address", "website_url"]).reset_index(drop=True)

        return df

# --- Notebook code cell 9 ---
business_df = run_playwright_async(
    collect_business_list,
    search_url=SEARCH_URL,
    max_businesses=MAX_BUSINESSES,
    headless=False
)

# --- Notebook code cell 10 ---
before = len(business_df)

business_df = business_df.drop_duplicates(
    subset=["address", "website_url"]
).reset_index(drop=True)

after = len(business_df)

print(before - after, "duplicates removed")

# --- Notebook code cell 11 ---
with pd.option_context('display.max_rows', None, 'display.max_colwidth', None, 'display.html.use_mathjax', False):
    display(business_df)
```

## 4. Review extraction from selected businesses

This is the longest extraction component. It reopens Google Maps, opens each business, navigates to the reviews panel, expands visible truncated reviews where possible, extracts review text and rating, checks truncation, removes duplicate reviews, and displays the working review table.

```python
# --- Notebook code cell 12 ---
n_reviews = 0

async def extract_reviews_from_search(search_url, max_businesses=10, max_reviews_per_business=50, headless=False):
    global n_reviews

    from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

    def normalise_website_url(href: str | None) -> str | None:
        if not href:
            return None
        parts = urlsplit(href)
        qs = parse_qsl(parts.query, keep_blank_values=True)
        drop_keys = {
            "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
            "gclid", "fbclid", "dclid", "gbraid", "wbraid"
        }
        qs2 = [(k, v) for (k, v) in qs if k.lower() not in drop_keys]
        query2 = urlencode(qs2, doseq=True)
        return urlunsplit((parts.scheme, parts.netloc, parts.path, query2, parts.fragment))

    async with async_playwright() as p:
        rows = []

        for i in range(max_businesses):
            browser = await p.chromium.launch(headless=headless)
            context = await browser.new_context(viewport={"width": 1280, "height": 900})
            page = await context.new_page()

            await page.goto(search_url, timeout=90000, wait_until="domcontentloaded")
            await page.wait_for_selector('div[role="feed"] div[role="article"]', timeout=90000)

            feed = page.locator('div[role="feed"]').first

            prev, stagnation = 0, 0
            while True:
                cards = page.locator('div[role="feed"] div[role="article"]')
                count = await cards.count()

                if count >= max_businesses:
                    break

                if count == prev:
                    stagnation += 1
                    if stagnation >= 8:
                        break
                else:
                    prev, stagnation = count, 0

                await feed.evaluate("(el) => el.scrollBy(0, Math.max(300, el.clientHeight * 0.85))")
                await page.wait_for_timeout(900)

            async def open_place_from_card(index, max_tries=5):
                for _ in range(max_tries):
                    cards_local = page.locator('div[role="feed"] div[role="article"]')
                    if await cards_local.count() <= index:
                        return False

                    card = cards_local.nth(index)

                    await card.scroll_into_view_if_needed()
                    await page.wait_for_timeout(150)

                    await card.click(timeout=8000)

                    deadline = time.monotonic() + 25
                    while time.monotonic() < deadline:
                        if await page.locator('button[data-item-id="address"], button[aria-label^="Address:"]').count() > 0:
                            return True
                        if await page.locator('a[data-item-id="authority"], a[aria-label^="Website:"]').count() > 0:
                            return True

                        if await page.locator("h1").first.count() > 0:
                            if await page.locator(
                                'button[data-item-id="address"], button[aria-label^="Address:"], a[data-item-id="authority"], a[aria-label^="Website:"]'
                            ).count() > 0:
                                return True

                        await page.wait_for_timeout(200)

                    await page.keyboard.press("Escape")
                    await page.wait_for_timeout(250)

                return False

            async def get_place_url_from_panel():
                cur = page.url or ""
                if "/maps/place/" in cur:
                    return cur

                a = page.locator('a[href*="/maps/place/"]').first
                if await a.count() > 0:
                    href = await a.get_attribute("href")
                    if href and "/maps/place/" in href:
                        return href

                m = page.locator('meta[itemprop="url"]').first
                if await m.count() > 0:
                    content = await m.get_attribute("content")
                    if content and "/maps/place/" in content:
                        return content

                canon = page.locator('link[rel="canonical"]').first
                if await canon.count() > 0:
                    href = await canon.get_attribute("href")
                    if href and "/maps/place/" in href:
                        return href

                og = page.locator('meta[property="og:url"]').first
                if await og.count() > 0:
                    content = await og.get_attribute("content")
                    if content and "/maps/place/" in content:
                        return content

                raise RuntimeError("FAILED to find canonical /maps/place/ url")

            async def get_address_text():
                loc = page.locator('button[data-item-id="address"] .Io6YTe').first
                if await loc.count() > 0:
                    txt = (await loc.inner_text()).strip()
                    if txt:
                        return txt

                b = page.locator('button[data-item-id="address"]').first
                if await b.count() > 0:
                    lab = await b.get_attribute("aria-label")
                    if lab:
                        lab = lab.strip()
                        if lab.lower().startswith("address:"):
                            lab = lab.split(":", 1)[1].strip()
                        if lab:
                            return lab

                b1 = page.locator('button[aria-label^="Address"]').first
                if await b1.count() > 0:
                    lab = await b1.get_attribute("aria-label")
                    if lab:
                        lab = lab.strip()
                        if lab.lower().startswith("address:"):
                            lab = lab.split(":", 1)[1].strip()
                        return lab or None

                b2 = page.locator('button[aria-label^="Copy address"]').first
                if await b2.count() > 0:
                    lab = await b2.get_attribute("aria-label")
                    if lab:
                        lab = lab.strip()
                        if lab.lower().startswith("address:"):
                            lab = lab.split(":", 1)[1].strip()
                        return lab or None

                return None

            async def goto_reviews_tab():
                tab = page.locator(
                    'button[role="tab"][aria-label*="Reviews"], button[role="tab"]'
                ).filter(has_text="Reviews").first
                await tab.click(timeout=60000)
                await page.wait_for_timeout(3000)

            async def pick_reviews_scroller():
                containers = page.locator("div.m6QErb.XiKgde")
                n = min(await containers.count(), 50)
                for k in range(n):
                    c = containers.nth(k)
                    if await c.locator("span.wiI7pd").count() > 0:
                        return c
                return containers.first

            async def click_visible_review_expanders(scroller, max_clicks=200):
                return await scroller.evaluate(
                    """(root, maxClicks) => {
                        function pickViewport(root) {
                          const candidates = [root, ...root.querySelectorAll('div')];
                          let best = root;
                          for (const el of candidates) {
                            const sh = el.scrollHeight || 0;
                            const ch = el.clientHeight || 0;
                            if (sh <= ch + 5) continue;
                            if (!el.querySelector('span.wiI7pd')) continue;
                            if ((best.scrollHeight || 0) < sh) best = el;
                          }
                          return best;
                        }

                        const viewport = pickViewport(root);
                        const vRect = viewport.getBoundingClientRect();
                        const nodes = Array.from(root.querySelectorAll('button, div[role="button"], span[role="button"], a[role="button"]'));

                        const isExpander = (el) => {
                          const al = (el.getAttribute('aria-label') || '').toLowerCase();
                          const txt = (el.innerText || '').trim().toLowerCase();
                          const js = (el.getAttribute('jsaction') || '').toLowerCase();

                          if (al === 'see more' || al === 'more' || al === 'read more') return true;
                          if (al.includes('see more') || al.includes('read more')) return true;
                          if (txt === 'more' || txt === 'see more' || txt === 'read more') return true;
                          if (js.includes('review') && (js.includes('expand') || js.includes('more'))) return true;
                          if (el.classList && (el.classList.contains('w8nwRe') || el.classList.contains('kyuRq'))) return true;

                          return false;
                        };

                        const clickable = nodes.filter(isExpander);

                        let clicked = 0;
                        for (const el of clickable) {
                          if (clicked >= maxClicks) break;

                          const ariaExpanded = el.getAttribute('aria-expanded');
                          if (ariaExpanded === 'true') continue;

                          const r = el.getBoundingClientRect();
                          const inView =
                            r.width > 0 && r.height > 0 &&
                            r.bottom > vRect.top + 4 && r.top < vRect.bottom - 4;

                          if (!inView) continue;

                          el.scrollIntoView({ block: 'center' });
                          el.click();
                          clicked++;
                        }

                        return { clicked, candidates: clickable.length };
                    }""",
                    max_clicks
                )

            async def settle_expansions(scroller, max_rounds=12):
                for _ in range(max_rounds):
                    res = await click_visible_review_expanders(scroller, max_clicks=220)
                    await page.wait_for_timeout(260)
                    if not res or res.get("clicked", 0) == 0:
                        break

            async def scroll_reviews_panel(scroller, frac=0.35):
                return await scroller.evaluate(
                    """(root, frac) => {
                        const candidates = [root, ...root.querySelectorAll('div')];
                        let best = null;

                        for (const el of candidates) {
                          const sh = el.scrollHeight || 0;
                          const ch = el.clientHeight || 0;
                          if (sh <= ch + 5) continue;
                          if (!el.querySelector('span.wiI7pd')) continue;
                          if (!best || el.scrollHeight > best.scrollHeight) best = el;
                        }

                        const target = best || root;
                        const before = target.scrollTop;
                        target.scrollTop = before + target.clientHeight * frac;
                        return target.scrollTop !== before;
                    }""",
                    frac
                )

            async def extract_visible_reviews_js(scroller):
                return await scroller.evaluate(
                    """(root) => {
                        const blocks = Array.from(root.querySelectorAll('div.MyEned, div[data-review-id], div[jscontroller]'));
                        const out = [];

                        for (const b of blocks) {
                          const textEl = b.querySelector('span.wiI7pd');
                          const text = textEl ? textEl.innerText.trim() : '';
                          if (!text) continue;

                          let key = null;

                          const ridBtn = b.querySelector('button[data-review-id]');
                          if (ridBtn) key = ridBtn.getAttribute('data-review-id');

                          if (!key) {
                            const direct = b.getAttribute && b.getAttribute('data-review-id');
                            if (direct) key = direct;
                          }

                          if (!key) {
                            const ctrlBtn = b.querySelector('button[aria-controls]');
                            if (ctrlBtn) key = ctrlBtn.getAttribute('aria-controls');
                          }

                          if (!key && b.id) key = b.id;
                          if (!key) key = text.slice(0, 160);

                          let rating = null;
                          let n = b;
                          for (let i = 0; i < 18 && n; i++) {
                            const star = n.querySelector('span.kvMYJc[role="img"][aria-label]');
                            if (star) {
                              const lab = star.getAttribute('aria-label') || '';
                              const m = lab.match(/(\\d+)/);
                              rating = m ? parseInt(m[1], 10) : null;
                              break;
                            }
                            n = n.parentElement;
                          }

                          const hasMore =
                            !!b.querySelector('button[aria-label="See more"], button[jsaction*="review.expandReview"], button.w8nwRe.kyuRq') ||
                            Array.from(b.querySelectorAll('button')).some(x => ((x.innerText || '').trim().toLowerCase() === 'more'));

                          out.push({ key, text, rating, has_more: hasMore });
                        }

                        return out;
                    }"""
                )

            async def force_expand_if_truncated(review_container):
                text_loc = review_container.locator("span.wiI7pd").first
                if await text_loc.count() == 0:
                    return False

                txt = (await text_loc.inner_text()).strip()
                if not txt or not txt.endswith("…"):
                    return False

                btn = review_container.locator(
                    'button[aria-label="See more"], button[jsaction*="review.expandReview"], button.w8nwRe.kyuRq'
                ).first

                if await btn.count() == 0:
                    btn = review_container.locator("button").filter(has_text="More").first

                if await btn.count() == 0:
                    return False

                for _ in range(4):
                    await btn.scroll_into_view_if_needed(timeout=2500)
                    await page.wait_for_timeout(120)
                    await btn.click(timeout=2500)
                    await page.wait_for_timeout(380)

                    txt2 = (await text_loc.inner_text()).strip()
                    if txt2 and not txt2.endswith("…"):
                        return True

                return False

            ok = await open_place_from_card(i, max_tries=5)
            if ok:
                place_url = await get_place_url_from_panel()
                address = await get_address_text()

                website_url = None
                w = page.locator('a[data-item-id="authority"]').first
                if await w.count() > 0:
                    website_url = await w.get_attribute("href")

                if not website_url:
                    w2 = page.locator('a[aria-label^="Website:"]').first
                    if await w2.count() > 0:
                        website_url = await w2.get_attribute("href")

                website_url = normalise_website_url(website_url)

                try:
                    await goto_reviews_tab()
                    scroller = await pick_reviews_scroller()

                    seen = set()
                    deadline = time.monotonic() + 200
                    stagnation_r = 0

                    while len(seen) < max_reviews_per_business and time.monotonic() < deadline:
                        await settle_expansions(scroller, max_rounds=12)

                        batch = await extract_visible_reviews_js(scroller)
                        added = 0

                        for item in batch:
                            key = item.get("key")
                            if not key or key in seen:
                                continue

                            text = (item.get("text") or "").strip()

                            if text.endswith("…") and item.get("has_more"):
                                conts = scroller.locator("div.MyEned")
                                n_conts = await conts.count()

                                fixed = False
                                for idx in range(min(n_conts, 60)):
                                    cont = conts.nth(idx)
                                    tloc = cont.locator("span.wiI7pd").first
                                    if await tloc.count() == 0:
                                        continue
                                    t = (await tloc.inner_text()).strip()
                                    if t == text:
                                        fixed = await force_expand_if_truncated(cont)
                                        break

                                if fixed:
                                    batch2 = await extract_visible_reviews_js(scroller)
                                    match = next((x for x in batch2 if x.get("key") == key), None)
                                    if match and (match.get("text") or "").strip():
                                        text = (match.get("text") or "").strip()

                                if text.endswith("…"):
                                    continue

                            seen.add(key)
                            rows.append(
                                {
                                    "url": place_url,
                                    "address": address,
                                    "website_url": website_url,
                                    "review": text,
                                    "rating": item.get("rating"),
                                }
                            )

                            n_reviews += 1
                            tick(n_reviews)

                            added += 1
                            if len(seen) >= max_reviews_per_business:
                                break

                        if added == 0:
                            stagnation_r += 1
                            if stagnation_r >= 14:
                                break
                        else:
                            stagnation_r = 0

                        moved = await scroll_reviews_panel(scroller, frac=0.35)
                        await page.wait_for_timeout(1500)

                        if not moved:
                            await settle_expansions(scroller, max_rounds=8)
                            break

                except Exception:
                    pass

            await context.close()
            await browser.close()

        df = pd.DataFrame(rows)
        if not df.empty:
            df = df.drop_duplicates(subset=["url", "address", "website_url", "review", "rating"]).reset_index(drop=True)

        return df

# --- Notebook code cell 13 ---
reviews_df = run_playwright_async(
    extract_reviews_from_search,
    search_url=SEARCH_URL,
    max_businesses=MAX_BUSINESSES,
    max_reviews_per_business=MAX_REVIEWS,
    headless=False
)

# --- Notebook code cell 14 ---
with pd.option_context('display.max_rows', None, 'display.max_colwidth', None, 'display.html.use_mathjax', False):
    display(reviews_df[['address', 'website_url', 'review', 'rating']])

# --- Notebook code cell 15 ---
reviews_df.duplicated().sum()

# --- Notebook code cell 16 ---
percentage = (
    reviews_df["review"]
    .astype(str)
    .str.strip()
    .str.endswith("…")
    .mean() * 100
    if not reviews_df.empty else 0
)

percentage

# --- Notebook code cell 17 ---
reviews_df = reviews_df.drop_duplicates(subset=["review"])

# --- Notebook code cell 18 ---
with pd.option_context('display.max_rows', None, 'display.max_colwidth', None, 'display.html.use_mathjax', False):
    display(reviews_df)

# --- Notebook code cell 19 ---
len(reviews_df)
```

## 5. OpenAI client setup

The notebook then loads an OpenAI API key from a local project folder and creates a client. On a public version, this should be replaced with your own environment-variable or secrets-management method.

```python
# --- Notebook markdown cell 20 ---
# # API key

# --- Notebook code cell 21 ---
# API_KEY = Path("openai_key.txt").read_text().strip()

def load_openai_key():
    """
    Locate and load API key from shared file:
    D:\Sync\Python Projects\openai\openai_key

    Works from any notebook inside 'Python Projects'
    """

    # Start from current working directory
    current = Path.cwd()

    # Traverse upwards until we find "Python Projects"
    for parent in [current] + list(current.parents):
        if parent.name == "Python Projects":
            key_path = parent / "openai" / "openai_key.txt"
            return key_path.read_text().strip()

    raise FileNotFoundError("Could not locate 'Python Projects' root")
    
OPENAI_API_KEY = load_openai_key()

client = openai.OpenAI(api_key=OPENAI_API_KEY)
```

## 6. Filtering reviews for causal structure

Not every review is useful for demand analysis. This classifier keeps reviews that describe a process, interaction, constraint, expectation mismatch, decision point, or recovery/failure sequence. Generic praise and outcome-only complaints are filtered out.

```python
# --- Notebook code cell 22 ---
n_review = 0

def classify_review_has_causal_structure(review_text):
    global n_review
    n_review += 1
    tick(n_review)

    """
    Classify whether a review contains causal / structural information.

    Returns:
      - True: review contains usable signal (process, interaction, constraint, etc.)
      - False: review is generic / outcome-only
      - "API Error": OpenAI call failed
      - "Empty": input text invalid
    """

    if not isinstance(review_text, str) or not review_text.strip():
        return "Empty"

    messages = [
        {
            "role": "system",
            "content": """You are classifying a customer review.

Return ONLY one word: true or false

Return "true" if the review contains ANY of the following:
- a sequence of events or process (e.g. arrival, waiting, during, after)
- an interaction between customer and staff (e.g. told, asked, explained, ignored)
- a decision point or consent moment (e.g. size, placement, timing, pricing, approval)
- a constraint (e.g. time delay, environment, policy, availability)
- an expectation mismatch (e.g. “I expected”, “wasn’t told”, “I assumed”)
- a response or lack of response to an issue (e.g. apology, explanation, no update)

Return "false" if the review is only:
- generic praise or recommendation
- generic complaint with no detail
- outcome-only statement (e.g. “great tattoo”, “bad service”) without describing what happened

If unsure, return "true".

Do not explain. Output only "true" or "false".
"""
        },
        {
            "role": "user",
            "content": f"""Review:
"{review_text}"
"""
        },
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=messages,
            max_tokens=3,
            temperature=0.0,
        )
    except Exception:
        return "API Error"

    raw = (response.choices[0].message.content or "").strip().lower()

    # Strict normalisation
    if raw == "true":
        return True
    elif raw == "false":
        return False
    else:
        return "Non Binary"

# --- Notebook code cell 23 ---
reviews_df = reviews_df.copy()

reviews_df.loc[:, 'causal_structure'] = reviews_df['review'].apply(classify_review_has_causal_structure)

# --- Notebook code cell 24 ---
reviews_df

# --- Notebook code cell 25 ---
reviews_df.causal_structure.value_counts()
```

## 7. Rating distribution and causal subset

This section plots the distribution of all ratings, then narrows the dataset to reviews that passed the causal-structure classifier. That matters because the analysis is trying to find repeated mechanisms, not merely count sentiment.

```python
# --- Notebook code cell 26 ---
def plot_rating_distribution(df, rating_col="rating"):
    """
    Create a frequency bar plot of ratings (1–5).

    Args:
    - df: pandas DataFrame
    - rating_col: column containing rating values (expected 1–5)

    Behaviour:
    - Ensures all ratings 1–5 appear (even if count = 0)
    - Displays counts as bar heights
    """

    # Clean + coerce to numeric
    ratings = pd.to_numeric(df[rating_col], errors="coerce").dropna()

    # Count frequencies, ensure 1–5 present
    counts = ratings.value_counts().reindex([1, 2, 3, 4, 5], fill_value=0).sort_index()

    # Plot
    plt.figure()
    plt.bar(counts.index.astype(int), counts.values)

    plt.xlabel("Rating")
    plt.ylabel("Frequency")
    plt.title("Review Rating Distribution")

    plt.xticks([1, 2, 3, 4, 5])

    plt.show()

    return counts

# --- Notebook code cell 27 ---
plot_rating_distribution(reviews_df, rating_col="rating")

# --- Notebook code cell 28 ---
reviews_df.duplicated().sum()

# --- Notebook code cell 29 ---
subset_df = reviews_df.query('causal_structure == True')

# --- Notebook code cell 30 ---
len(subset_df)

# --- Notebook code cell 31 ---
plot_rating_distribution(subset_df, rating_col="rating")

# --- Notebook code cell 32 ---
with pd.option_context('display.max_rows', None, 'display.max_colwidth', None, 'display.html.use_mathjax', False):
    display(subset_df.review)

# --- Notebook code cell 33 ---
subset_df
```

## 8. Extracting causal atoms from each useful review

This is the core LLM analysis stage. Each causally useful review is converted into short operational atoms: mechanism statements, evidence snippets, tags, persona cues, severity, and confidence.

```python
# --- Notebook code cell 34 ---
n_atoms = 0

def extract_causal_atoms(
    review_text: str,
    max_atoms: int = 8,
    model: str = "gpt-5.2",
    reasoning_effort: str = "low",
    max_output_tokens: int = 600,
):
    global n_atoms
    n_atoms += 1
    tick(n_atoms)

    if not isinstance(review_text, str) or not review_text.strip():
        return "Empty"

    max_atoms = int(max(1, min(max_atoms, 30)))
    max_output_tokens = int(max(16, max_output_tokens))

    developer = f"""Extract operationally usable causal structure from ONE review.

Definition of usable:
- process step, constraint + response, decision/confirmation moment, policy/guarantee/time window,
  failure + recovery, or explicit expectation management.

Evidence gate:
- Provide "evidence" as a short verbatim snippet from the review where possible.
- If you cannot quote exact words, still include the atom but keep evidence as the closest short phrase.

Return ONLY JSON with EXACT keys (no extras):
{{
  "is_high_fidelity": true/false,
  "fidelity_reason": "short (<= 16 words)",
  "atoms": [
    {{
      "atom": "replicable mechanism statement (<= 12 words)",
      "evidence": "short snippet (<= 12 words)",
      "tags": ["optional free-text tags"]
    }}
  ],
  "persona_cues": ["short cues grounded in text"],
  "severity": 0,
  "confidence": 0.0
}}

Limit atoms to {max_atoms}.
No backticks. No commentary.
"""

    t0 = time.time()
    try:
        kwargs = {
            "model": model,
            "input": [
                {"role": "developer", "content": developer},
                {"role": "user", "content": f'Review:\n"""{review_text}"""'},
            ],
            "max_output_tokens": max_output_tokens,
        }
        if "gpt-5" in model:
            kwargs["reasoning"] = {"effort": reasoning_effort}

        resp = client.responses.create(**kwargs)

    except Exception as e:
        print(f"API Error after {time.time()-t0:.1f}s:", repr(e))
        return "API Error"

    raw = (getattr(resp, "output_text", None) or "").strip()
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw, flags=re.IGNORECASE).strip()

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError:
        print("Non-JSON output (head):", raw[:600])
        return "Non JSON"

    required_keys = {"is_high_fidelity", "fidelity_reason", "atoms", "persona_cues", "severity", "confidence"}
    if not isinstance(result, dict) or set(result.keys()) != required_keys:
        return "Non JSON"

    txt = review_text

    def norm(s: str) -> str:
        s = s.lower()
        s = re.sub(r"[^\w\s]", " ", s)
        s = re.sub(r"\s+", " ", s).strip()
        return s

    t_norm = norm(txt)

    def ev_ok(evidence: str) -> bool:
        if not isinstance(evidence, str) or not evidence.strip():
            return False
        return norm(evidence) in t_norm

    def clean_tags(tags):
        if not isinstance(tags, list):
            return []
        out = []
        for t in tags:
            if isinstance(t, str) and t.strip():
                out.append(t.strip()[:40])
        return out[:6]

    # Keep BOTH:
    # - atoms that pass evidence (for high-fidelity use)
    # - atoms that fail evidence (for coverage / later inspection)
    atoms_out = []
    passed = 0

    for it in result["atoms"][:max_atoms]:
        if not isinstance(it, dict) or set(it.keys()) != {"atom", "evidence", "tags"}:
            continue

        atom = it.get("atom")
        evidence = it.get("evidence")

        if not isinstance(atom, str) or not atom.strip():
            continue
        if not isinstance(evidence, str):
            evidence = ""

        ok = ev_ok(evidence)
        if ok:
            passed += 1

        atoms_out.append(
            {
                "atom": atom.strip()[:120],
                "evidence": evidence.strip()[:120],
                "tags": clean_tags(it.get("tags")),
                # NOTE: if you must keep EXACT keys everywhere, remove this field.
                # Better: put it in tags like "evidence_ok:true".
            }
        )

    persona = []
    for p in result["persona_cues"]:
        if isinstance(p, str) and p.strip():
            persona.append(p.strip()[:80])
    persona = persona[:10]

    # Recompute fidelity from evidence pass-rate, but DO NOT delete atoms.
    is_high = (passed > 0)
    fidelity_reason = result["fidelity_reason"].strip()[:200]
    if not is_high:
        fidelity_reason = "Atoms returned; evidence match failed (normalisation mismatch likely)"

    try:
        severity = max(0, min(3, int(result.get("severity", 0))))
    except Exception:
        severity = 0
    try:
        confidence = max(0.0, min(1.0, float(result.get("confidence", 0.7))))
    except Exception:
        confidence = 0.7

    return {
        "is_high_fidelity": bool(is_high),
        "fidelity_reason": fidelity_reason,
        "atoms": atoms_out,
        "persona_cues": persona,
        "severity": severity,
        "confidence": confidence,
    }

# --- Notebook code cell 35 ---
subset_df = subset_df.copy()

subset_df["causal_analysis"] = subset_df["review"].apply(
    lambda x: extract_causal_atoms(x, model="gpt-4.1-mini")
)

# --- Notebook code cell 36 ---
for i, row in subset_df.iterrows():
    print(f"\nROW {i}")
    print(json.dumps(row["causal_analysis"], indent=2))
```

## 9. Flattening the causal analysis and exporting the review CSV

The nested JSON is flattened into ordinary table columns. The notebook then exports the full causally useful review dataset as a single CSV file. The rating column is preserved, so five-star, three-to-four-star, and one-to-two-star reviews can be compared later without splitting the data during export.

```python
# --- Notebook code cell 37 ---
def flatten_causal_analysis(df, col):
    def extract(row):
        data = row if isinstance(row, dict) else {}

        atoms = data.get("atoms", [])
        persona = data.get("persona_cues", [])

        return {
            f"{col}_is_high_fidelity": data.get("is_high_fidelity"),
            f"{col}_confidence": data.get("confidence"),
            f"{col}_n_atoms": len(atoms),
            f"{col}_atoms_text": " | ".join(
                [f"{a.get('atom')} → {a.get('evidence')}" for a in atoms]
            ),
            f"{col}_persona": ", ".join(persona),
        }

    expanded = df[col].apply(extract).apply(pd.Series)
    return pd.concat([df, expanded], axis=1)

# --- Notebook code cell 38 ---
subset_df = flatten_causal_analysis(subset_df, "causal_analysis")

# --- Notebook code cell 39 ---
subset_df.columns

# --- Notebook code cell 40 ---
subset_df.isna().sum()

# --- Notebook code cell 41 ---
with pd.option_context('display.max_rows', None, 'display.max_colwidth', None, 'display.html.use_mathjax', False):
    display(subset_df[['website_url', 'address', 'rating', 'review', 'causal_analysis_confidence', 'causal_analysis_n_atoms', 'causal_analysis_atoms_text', 'causal_analysis_persona']])

# --- Notebook code cell 42 ---
with pd.option_context('display.max_rows', None, 'display.max_colwidth', None, 'display.html.use_mathjax', False):
    display(subset_df.query('rating < 5')[['website_url', 'rating', 'review', 'causal_analysis_atoms_text', 'causal_analysis_persona']])

# --- Notebook code cell 43 ---
with pd.option_context('display.max_rows', None, 'display.max_colwidth', None, 'display.html.use_mathjax', False):
    display(subset_df.query('rating == 5')[['website_url', 'rating', 'review', 'causal_analysis_atoms_text', 'causal_analysis_persona']])

# --- Notebook code cell 44 ---
subset_df.to_csv('reviews.csv', index=False)

# --- Notebook code cell 45 ---
end_time = datetime.now()

print(datetime.now().strftime('%Y-%m-%d %H:%M'))

# --- Notebook code cell 46 ---
# compute delta
time_delta = end_time - start_time

print(f"Start: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
print(f"End:   {end_time.strftime('%Y-%m-%d %H:%M:%S')}")
print(f"Delta: {time_delta}")
```

## Analysing the exported CSV with ChatGPT or another LLM

Once the notebook has produced `reviews.csv`, the next step is interpretive analysis.

Upload the file:

```text
reviews.csv
```

Then ask the model to compare the structures across rating groups inside the same dataset.

Use these prompts.

### 1. What exists across all review ratings?

```text
Using `reviews.csv`, identify what exists across all review ratings.

Focus on repeated service expectations, journey stages, customer needs, emotional cues, operational constraints, and satisfaction/dissatisfaction triggers.

Do not merely summarise the reviews. Infer the stable customer-experience structure that appears across all rating groups.
```

### 2. What exists only in five-star ratings?

```text
Using `reviews.csv`, filter to rating == 5 and identify what exists only in five-star ratings.

Focus on what successful experiences consistently contain:
- staff behaviours
- service moments
- product or environment qualities
- trust signals
- expectation management
- journey moments that appear to convert customers into advocates

Compare against the other rating groups and exclude patterns that also appear outside five-star reviews.
```

### 3. What exists only in one-star or two-star ratings?

```text
Using `reviews.csv`, filter to rating in [1, 2] and isolate the one-star and two-star reviews.

Identify what exists only in these low-rating reviews.

Focus on severe journey failures:
- broken expectations
- staff conflict
- waiting or timing problems
- poor communication
- refusal, neglect, confusion, or failed recovery
- customer emotions that indicate abandonment or churn risk

Separate isolated incidents from repeated structural failures.
```

### 4. What exists only in three-star or four-star ratings?

```text
Using `reviews.csv`, filter to rating in [3, 4] and isolate the three-star and four-star reviews.

Identify what exists only in these middle-rating reviews.

Focus on partial success:
- customers who liked something but still felt friction
- experience trade-offs
- conditional recommendations
- weak points that did not fully destroy the experience
- improvement areas that could convert acceptable experiences into excellent ones

Explain how these differ from both five-star reviews and one-star/two-star reviews.
```

### 5. What customer journey map is inferred?

```text
Using `reviews.csv`, infer the customer journey map.

Break the journey into stages, such as:
- search/discovery
- selection
- arrival
- ordering or booking
- service interaction
- waiting
- consumption or delivery
- issue handling
- payment
- post-experience judgement
- review trigger

For each stage, identify:
- customer expectation
- positive signals
- negative signals
- failure modes
- recovery opportunities
- evidence from the review data
```

### 6. What unmet customer demand is inferred?

```text
Using `reviews.csv`, infer unmet customer demand.

Do not simply list complaints.

Identify demand that appears structurally underserved by the local market:
- needs customers repeatedly express indirectly
- expectations that are not reliably met
- service moments where competitors fail
- emotional or practical outcomes customers seem to want
- positioning opportunities for a business entering or improving in this local category

Separate:
1. explicit unmet demand
2. implied unmet demand
3. weak signals worth testing
4. likely content/SEO angles
5. operational changes a business could make
```

## What this changes strategically

The notebook turns local SEO and Google Maps competitor analysis into something more useful than a directory scrape.

The usual workflow is:

```text
find competitors
→ map locations
→ compare ratings
→ export data
```

This workflow adds the missing demand layer:

```text
find competitors
→ extract reviews
→ isolate causally useful reviews
→ extract journey atoms
→ compare satisfaction, dissatisfaction, and near-miss reviews by rating
→ infer unmet demand
→ identify positioning opportunities
```

That changes the object of analysis.

The market is no longer just a set of businesses on a map. It becomes a set of customer journeys, some successful and some broken, distributed across a local competitive landscape.

That is the useful claim:

```text
Competitor mapping tells you where the market is crowded.
Review journey mapping tells you where the market is still weak.
```
