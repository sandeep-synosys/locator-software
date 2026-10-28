// Local production-build regression checks. Never submit leads or send live analytics.
// PLAYWRIGHT_MODULE can point to an existing Playwright installation.
/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.PERFORMANCE_ORIGIN || 'http://127.0.0.1:43121';
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw Error('Local test origins only');
const phase = process.env.PERFORMANCE_PHASE || 'after';
const output = process.env.PERFORMANCE_ARTIFACT_DIR;
if (!output) throw Error('Set PERFORMANCE_ARTIFACT_DIR');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH });
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [], external = [];
      await context.route('**/*', async route => {
        if (route.request().url().startsWith(origin + '/')) return route.continue();
        external.push(route.request().url());
        if (route.request().url().startsWith('https://challenges.cloudflare.com/turnstile/v0/api.js')) {
          return route.fulfill({ contentType: 'application/javascript', body: `
            window.turnstile = { render(el, options) {
              const button = document.createElement('button'); button.type = 'button';
              button.textContent = 'Complete test security check';
              button.onclick = () => options.callback('test-token'); el.appendChild(button); return 'test';
            }, remove() {} }; window.locatorTurnstileLoaded();` });
        }
        return route.fulfill({ contentType: 'text/plain', body: '' });
      });
      const page = await context.newPage();
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(origin, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const baseline = await page.evaluate(() => {
        const rect = selector => {
          const r = document.querySelector(selector).getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        };
        return {
          elements: document.querySelectorAll('*').length,
          imagePreloads: document.querySelectorAll('link[rel="preload"][as="image"]').length,
          hero: rect('.hero-section-wrapper'), skyline: rect('.hero-building-wrap img'),
          slider: rect('.fs-scene-wrap'),
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      await page.screenshot({ path: path.join(output, `home-${phase}-${width}.png`), animations: 'disabled' });
      fs.writeFileSync(path.join(output, `home-${phase}-${width}.json`), JSON.stringify(baseline, null, 2));
      if (phase === 'after') {
        assert.equal(external.some(url => url.includes('challenges.cloudflare.com')), false, 'Footer does not start verification at initial load');
        assert.equal(baseline.overflow, false, 'Homepage fits the viewport');
        const before = JSON.parse(fs.readFileSync(path.join(output, `home-before-${width}.json`)));
        for (const name of ['hero', 'skyline', 'slider']) {
          for (const dimension of ['width', 'height']) {
            assert.ok(Math.abs(before[name][dimension] - baseline[name][dimension]) < 2,
              `${name} ${dimension} changed: ${before[name][dimension]} -> ${baseline[name][dimension]}`);
          }
        }
        assert.ok(baseline.imagePreloads < before.imagePreloads, 'Initial artwork preloads reduced');

        const slider = page.locator('[data-feature-slider]');
        await slider.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector('.fs-scene-wrap img')?.complete);
        const next = slider.getByRole('button', { name: 'Next feature', exact: true });
        for (const title of ['Expense Manager', 'Inspection', 'Fleet Manager', 'Task Manager']) {
          await next.click();
          await slider.getByText(title, { exact: true }).first().waitFor();
          await page.waitForTimeout(600);
        }
        await slider.screenshot({ path: path.join(output, `slider-after-${width}.png`), animations: 'disabled' });

        await page.locator('footer').scrollIntoViewIfNeeded();
        const field = page.locator('[data-turnstile-action="quick_contact"]');
        await field.getByRole('button', { name: 'Complete test security check' }).waitFor();
        const form = page.locator('form').filter({ has: field });
        assert.equal(await form.locator('button[type="submit"]').isDisabled(), true);
        await field.getByRole('button', { name: 'Complete test security check' }).click();
        assert.equal(await form.locator('button[type="submit"]').isDisabled(), false);
        assert.equal(external.filter(url => url.includes('turnstile/v0/api.js')).length, 1);
        await page.screenshot({ path: path.join(output, `footer-after-${width}.png`), animations: 'disabled' });

        // Scroll back through the pinned showcase and then leave via a real CTA.
        await page.evaluate(() => scrollTo(0, 0));
        const quote = page.locator('a[href="/get-a-quote"]').filter({ visible: true }).first();
        await quote.click();
        await page.waitForURL('**/get-a-quote');
        await page.locator('[data-turnstile-action="quote"]').waitFor();
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.goto(origin, { waitUntil: 'networkidle' });
        if (width >= 1024) {
          await page.waitForFunction(() => document.querySelectorAll('.pin-spacer').length === 2);
        }
        for (const row of await page.locator('.ss-row').all()) {
          const skip = row.locator('.skip-btn');
          await skip.scrollIntoViewIfNeeded();
          await skip.waitFor({ state: 'visible' });
          const startY = await page.evaluate(() => scrollY);
          await skip.click();
          await page.waitForFunction(y => Math.abs(scrollY - y) > 100, startY);
          await page.waitForTimeout(1300);
        }
        assert.deepEqual(errors, []);
      }
      console.log(JSON.stringify({ phase, width, ...baseline, errors }));
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
