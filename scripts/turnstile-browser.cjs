// Automated integration checks, not a CAPTCHA bypass for a deployed app.
// 1. Build locally with NEXT_PUBLIC_TURNSTILE_SITE_KEY=browser-test-site-key.
// 2. Set PLAYWRIGHT_MODULE/CHROME_PATH to installed Playwright/Chrome if needed.
// 3. Run: node scripts/turnstile-browser.cjs
// 4. Rebuild with your real configuration after testing. Never deploy the fixture build.
// All external resources are intercepted. The local server has an empty secret,
// so server actions cannot send email; contact success is a mocked HTTP response.
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const widgetScript = `(() => {
  const widgets = new Map(); let seq = 0;
  window.__turnstileTest = { widgets };
  window.turnstile = {
    ready() { throw new Error('turnstile.ready() must not be called with an async script'); },
    render(el, options) {
      const id = String(++seq);
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = 'Complete test security check';
      button.style.cssText = 'width:100%;height:100%;border:1px solid #aaa;background:#fafafa;color:#222';
      el.style.height = options.size === 'compact' ? '140px' : '65px';
      button.style.width = options.size === 'compact' ? '150px' : '100%';
      if (options.size === 'flexible') button.style.minWidth = '300px';
      button.onclick = () => options.callback('token-' + options.action + '-' + id);
      el.appendChild(button); widgets.set(id, { el, options }); return id;
    },
    remove(id) { const item = widgets.get(id); if (item) item.el.replaceChildren(); widgets.delete(id); }
  };
  const callback = new URL(document.currentScript.src).searchParams.get('onload');
  if (callback) window[callback]();
})();`;

async function check(origin) {
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  let checks = 0;
  try {
    async function setup(path, mobile = false, failScript = false) {
      const context = await browser.newContext({ viewport: mobile ? { width: typeof mobile === 'number' ? mobile : 390, height: 844 } : { width: 1440, height: 1000 } });
      const errors = [], diagnostics = [], framePolicies = [];
      let scriptRequests = 0;
      await context.route('**/*', async route => {
        const url = route.request().url();
        if (url.startsWith(origin)) return route.continue();
        // Optional smoke check: load the genuine SDK, but never submit a form.
        if (process.env.LIVE_TURNSTILE_SDK === 'true' && url.startsWith('https://challenges.cloudflare.com/')) return route.continue();
        if (url.startsWith('https://challenges.cloudflare.com/turnstile/v0/api.js')) {
          scriptRequests++;
          if (failScript && scriptRequests === 1) return route.abort();
          return route.fulfill({ contentType: 'application/javascript', body: widgetScript });
        }
        return route.fulfill({ contentType: 'text/html', body: '' });
      });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        const text = message.text();
        if (text.startsWith('[LOCATOR Turnstile]')) diagnostics.push({ kind: 'verification', message: text });
        else if (/data:,|OTS parsing|powerPreference|No available adapters/.test(text) && diagnostics.length < 40) {
          let source = '';
          try { source = new URL(message.location().url).origin; } catch {}
          diagnostics.push({ kind: /data:,/.test(text) ? 'CSP data probe' : 'browser capability probe', source });
        }
      });
      page.on('response', async response => {
        if (response.url().startsWith('https://challenges.cloudflare.com/') && response.request().resourceType() === 'document') {
          const policy = await response.headerValue('content-security-policy').catch(() => null);
          if (policy) framePolicies.push({ source: 'https://challenges.cloudflare.com', cloudflareProbeHosts: /hagen\.challenges|dnstest/.test(policy) });
        }
      });
      await page.goto(origin + path, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-turnstile-action]');
      return { context, page, errors, diagnostics, framePolicies, scriptRequests: () => scriptRequests };
    }
    const field = (page, action) => page.locator(`[data-turnstile-action="${action}"]`);
    const form = (page, action) => page.locator('form').filter({ has: field(page, action) });
    const leadEvents = page => page.evaluate(() => (window.dataLayer || []).filter(event => event.event === 'locator_lead_submitted'));
    async function complete(page, action) {
      await field(page, action).scrollIntoViewIfNeeded();
      await field(page, action).getByRole('button', { name: 'Complete test security check' }).click();
    }
    async function event(page, action, name) {
      await page.evaluate(({ action, name }) => {
        const widget = [...window.__turnstileTest.widgets.values()].find(w => w.options.action === action);
        widget.options[name]();
      }, { action, name });
      await page.waitForFunction(action => document.querySelector('[data-turnstile-action="' + action + '"] input').value === '', action);
    }
    async function fillRequired(target) {
      for (const input of await target.locator('input[required]').all()) {
        const type = await input.getAttribute('type');
        if (type === 'checkbox') await input.check();
        else await input.fill(type === 'email' ? 'test@example.invalid' : type === 'number' ? '3' : 'Test enquiry');
      }
    }

    if (process.env.LIVE_TURNSTILE_SDK === 'true') {
      for (const [path, action] of [['/contact', 'contact'], ['/get-a-quote', 'quote'], ['/get-a-free-demo', 'demo']]) {
        const t = await setup(path);
        await t.page.waitForFunction(action => {
          const el = document.querySelector('[data-turnstile-action="' + action + '"] > div');
          return !!window.turnstile && !window.locatorTurnstileLoaded && el?.childElementCount > 0;
        }, action);
        assert.deepEqual(t.errors, []);
        await t.page.waitForFunction(action => document.querySelector('[data-turnstile-action="' + action + '"]')?.dataset.turnstileState !== 'pending', action,
          { timeout: 25000 }).catch(() => {});
        const status = await field(t.page, action).getAttribute('data-turnstile-state');
        const message = await field(t.page, action).getByRole('status').innerText();
        console.log(JSON.stringify({ action, status, message, framePolicies: t.framePolicies, diagnostics: t.diagnostics }));
        if (status === 'verified' && process.env.VERIFY_LIVE_TURNSTILE === 'true') {
          // Use the real verifier in isolation: this module has no mail code.
          // Keep tokens/secrets in memory and send them only to Cloudflare Siteverify.
          require('@next/env').loadEnvConfig(process.cwd());
          const fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript');
          const exports = {};
          const code = ts.transpileModule(fs.readFileSync('src/lib/turnstile.ts', 'utf8'), {
            compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
          }).outputText;
          vm.runInNewContext(code, { exports, require: id => { if (id !== 'server-only') throw Error('Unexpected verifier dependency'); return {}; },
            process, fetch, URLSearchParams, AbortSignal });
          const data = new FormData();
          data.set('cf-turnstile-response', await field(t.page, action).locator('input').inputValue());
          const result = await exports.verifyTurnstile(data, action);
          console.log(JSON.stringify({ action, liveServerVerification: result.success, error: result.success ? undefined : result.error }));
        }
        await t.context.close();
      }
      console.log('Live diagnostic run finished. Reported states are provider outcomes, not a guarantee of challenge success. No form submission or email delivery.');
      return;
    }

    if (process.env.EXPECT_TURNSTILE_CONFIGURED === 'false') {
      for (const [path, action] of [['/contact', 'contact'], ['/get-a-quote', 'quote'], ['/get-a-free-demo', 'demo']]) {
        const t = await setup(path, true);
        await field(t.page, action).getByText('Security verification is temporarily unavailable.', { exact: false }).waitFor();
        assert.equal(await form(t.page, action).locator('button[type=submit]').isDisabled(), true);
        assert.equal(await form(t.page, 'quick_contact').locator('button[type=submit]').isDisabled(), true);
        assert.equal(t.scriptRequests(), 0);
        await field(t.page, action).scrollIntoViewIfNeeded();
        // Let the site's existing scroll entrance animations finish before visual QA.
        await t.page.waitForTimeout(1200);
        if (process.env.SCREENSHOT_DIR) await t.page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/turnstile-${action}-unconfigured.png` });
        assert.deepEqual(t.errors, []);
        await t.context.close();
      }
      console.log('Missing-configuration browser checks passed for all forms; no Cloudflare script requested.');
      return;
    }

    for (const [path, action] of [['/contact', 'contact'], ['/get-a-quote', 'quote'], ['/get-a-free-demo', 'demo']]) {
      const t = await setup(path);
      const target = form(t.page, action);
      await field(t.page, action).getByRole('button', { name: 'Complete test security check' }).waitFor();
      assert.equal(await t.page.evaluate(action => [...window.__turnstileTest.widgets.values()].find(w => w.options.action === action).options.size, action), 'flexible', 'Desktop forms use the wide widget');
      const submit = target.locator('button[type=submit]');
      await field(t.page, action).getByRole('button', { name: 'Complete test security check' }).waitFor();
      assert.equal(t.scriptRequests(), 1, 'Main form and footer share one loader');
      assert.equal(await submit.isDisabled(), true);
      await complete(t.page, action);
      if (action === 'demo') await t.page.locator('.db-slot').first().click();
      assert.equal(await submit.isDisabled(), false);
      assert.match(await target.locator('[name="cf-turnstile-response"]').inputValue(), new RegExp('^token-' + action));
      await event(t.page, action, 'expired-callback');
      assert.equal(await submit.isDisabled(), true);
      assert.equal(await target.locator('[name="cf-turnstile-response"]').inputValue(), '');
      await field(t.page, action).getByRole('button', { name: 'Retry security check' }).click();
      await complete(t.page, action);
      assert.equal(await submit.isDisabled(), false);
      await event(t.page, action, 'error-callback');
      assert.equal(await submit.isDisabled(), true);
      await field(t.page, action).getByRole('button', { name: 'Retry security check' }).click();
      await complete(t.page, action);
      await fillRequired(target);
      if (action === 'contact') {
        await target.locator('[name=topic]').selectOption('Sales & pricing');
        await target.locator('[name=message]').fill('Mocked request only');
        await target.locator('[name=attachment]').setInputFiles({ name: 'draft.txt.pdf', mimeType: 'application/pdf', buffer: Buffer.from('test attachment') });
        let attempt = 0;
        await t.page.route('**/api/contact', route => {
          assert.match(route.request().postData(), /token-contact-/);
          attempt++;
          return route.fulfill({ status: attempt === 1 ? 400 : 200, contentType: 'application/json',
            body: attempt === 1 ? '{"success":false,"error":"Security verification test rejection"}' : '{"success":true}' });
        });
        await submit.click();
        await target.getByRole('alert').waitFor();
        assert.equal((await leadEvents(t.page)).length, 0, 'Rejected leads must not count as conversions');
        assert.equal(await target.locator('[name=name]').inputValue(), 'Test enquiry');
        assert.equal(await target.locator('[name=attachment]').evaluate(el => el.files.length), 1);
        await t.page.waitForFunction(() => document.querySelector('[data-turnstile-action="contact"] input').value === '');
        assert.equal(await submit.isDisabled(), true);
        await complete(t.page, action);
        await submit.click();
        await t.page.getByRole('heading', { name: 'Message received', exact: true }).waitFor();
        assert.deepEqual(await leadEvents(t.page), [{ event: 'locator_lead_submitted', form_type: 'contact' }],
          'A successful contact sends exactly one existing GTM conversion event');
      } else {
        // Actual server action, deliberately missing the secret: no Siteverify or SMTP call.
        await submit.click();
        await target.getByRole('alert').waitFor();
        assert.equal((await leadEvents(t.page)).length, 0, 'Failed server actions must not count as conversions');
        assert.equal(await target.locator('[name=name]').inputValue(), 'Test enquiry');
        await t.page.waitForFunction(action => document.querySelector('[data-turnstile-action="' + action + '"] input').value === '', action);
        assert.equal(await submit.isDisabled(), true);
      }
      assert.deepEqual(t.errors, []);
      checks += 5;
      await t.context.close();
    }

    const career = await setup('/about/career/sales-executive');
    assert.equal(await field(career.page, 'career_application').count(), 0, 'Career widget only mounts in the application tab');
    await career.page.getByRole('tab', { name: 'Application', exact: true }).click();
    await field(career.page, 'career_application').getByRole('button', { name: 'Complete test security check' }).waitFor();
    const application = form(career.page, 'career_application');
    const applicationSubmit = application.getByRole('button', { name: 'Submit application', exact: true });
    assert.equal(await applicationSubmit.isDisabled(), true);
    await complete(career.page, 'career_application');
    assert.equal(await applicationSubmit.isDisabled(), false);
    await event(career.page, 'career_application', 'expired-callback');
    assert.equal(await applicationSubmit.isDisabled(), true);
    await complete(career.page, 'career_application');
    await career.page.evaluate(() => { window.__oldCareerWidget = [...window.__turnstileTest.widgets.values()].find(w => w.options.action === 'career_application').options; });
    await career.page.getByRole('tab', { name: 'Overview', exact: true }).click();
    await career.page.waitForFunction(() => ![...window.__turnstileTest.widgets.values()].some(w => w.options.action === 'career_application'));
    await career.page.getByRole('tab', { name: 'Application', exact: true }).click();
    await field(career.page, 'career_application').getByRole('button', { name: 'Complete test security check' }).waitFor();
    await career.page.evaluate(() => window.__oldCareerWidget.callback('removed-career-token'));
    assert.equal(await applicationSubmit.isDisabled(), true, 'Old tab callbacks cannot verify the new application');
    for (const [name, value] of Object.entries({ firstName: 'Test', lastName: 'Applicant', email: 'test@example.invalid',
      phone: '0500000000', coverLetter: 'Keep this application after failure', onsite: 'Yes', salary: 'AED 3000' })) {
      await application.locator(`[name="${name}"]`).fill(value);
    }
    await application.locator('[name=resume]').setInputFiles({ name: 'resume.pdf', mimeType: 'application/pdf', buffer: Buffer.from('Mock resume') });
    await application.locator('.jd-yn-btn').filter({ hasText: /^Yes$/ }).click();
    await complete(career.page, 'career_application');
    // The genuine API denies this request: the test server has an empty secret.
    await applicationSubmit.click();
    await application.getByRole('alert').getByText('Security verification is temporarily unavailable.', { exact: false }).waitFor();
    await career.page.waitForFunction(() => document.querySelector('[data-turnstile-action="career_application"] input').value === '');
    assert.equal(await applicationSubmit.isDisabled(), true);
    assert.equal(await application.locator('[name=firstName]').inputValue(), 'Test');
    assert.equal(await application.locator('[name=coverLetter]').inputValue(), 'Keep this application after failure');
    assert.equal(await application.locator('[name=resume]').evaluate(el => el.files[0].name), 'resume.pdf');
    assert.equal(await application.locator('[name=screening][value=yes]').isChecked(), true);
    assert.equal(career.scriptRequests(), 1, 'Career and footer share the SDK');
    await career.page.route('**/api/career-application', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true }) }));
    await complete(career.page, 'career_application');
    await applicationSubmit.click();
    await career.page.getByRole('heading', { name: 'Application received', exact: true }).waitFor();
    assert.equal(await field(career.page, 'career_application').count(), 0);
    assert.deepEqual(career.errors, []);
    checks += 6;
    await career.context.close();

    for (const width of [320, 390]) {
      const mobileCareer = await setup('/about/career/sales-executive', width);
      await mobileCareer.page.getByRole('tab', { name: 'Application', exact: true }).click();
      const widget = field(mobileCareer.page, 'career_application').getByRole('button', { name: 'Complete test security check' });
      await widget.waitFor();
      const bounds = await widget.boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
      await complete(mobileCareer.page, 'career_application');
      assert.equal(await form(mobileCareer.page, 'career_application').locator('button[type=submit]').isDisabled(), false);
      if (process.env.SCREENSHOT_DIR) {
        await widget.scrollIntoViewIfNeeded();
        await mobileCareer.page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/turnstile-career-${width}-mobile.png` });
      }
      assert.deepEqual(mobileCareer.errors, []);
      checks++;
      await mobileCareer.context.close();
    }

    const footer = await setup('/contact');
    const quick = form(footer.page, 'quick_contact');
    assert.equal(await quick.locator('button[type=submit]').isDisabled(), true);
    await complete(footer.page, 'quick_contact');
    await quick.locator('[name=name]').fill('Footer test');
    await quick.locator('[name=email]').fill('test@example.invalid');
    await quick.locator('[name=phone]').fill('+971000000000');
    await quick.locator('[name=message]').fill('No real delivery');
    await quick.locator('button[type=submit]').click();
    await quick.getByText('Security verification is temporarily unavailable.', { exact: false }).waitFor();
    assert.equal(await quick.locator('[name=name]').inputValue(), 'Footer test');
    await footer.page.waitForFunction(() => document.querySelector('[data-turnstile-action="quick_contact"] input').value === '');
    assert.equal(await quick.locator('button[type=submit]').isDisabled(), true);
    assert.deepEqual(footer.errors, []);
    checks++;
    await footer.context.close();

    const blocked = await setup('/contact', false, true);
    await field(blocked.page, 'contact').getByRole('button', { name: 'Retry security check' }).waitFor();
    assert.equal(await form(blocked.page, 'contact').locator('button[type=submit]').isDisabled(), true);
    await field(blocked.page, 'contact').getByRole('button', { name: 'Retry security check' }).click();
    await complete(blocked.page, 'contact');
    assert.equal(await form(blocked.page, 'contact').locator('button[type=submit]').isDisabled(), false);
    assert.equal(blocked.scriptRequests(), 2);
    checks++;
    await blocked.context.close();

    for (const [path, action] of [['/contact', 'contact'], ['/get-a-quote', 'quote'], ['/get-a-free-demo', 'demo']]) {
      for (const width of [320, 390]) {
        const mobile = await setup(path, width);
        await field(mobile.page, action).getByRole('button', { name: 'Complete test security check' }).waitFor();
        const bounds = await field(mobile.page, action).boundingBox();
        assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
        assert.equal(await mobile.page.evaluate(action => [...window.__turnstileTest.widgets.values()].find(w => w.options.action === action).options.size,
          action), bounds.width >= 300 ? 'flexible' : 'compact');
        const widgetBounds = await field(mobile.page, action).getByRole('button', { name: 'Complete test security check' }).boundingBox();
        assert.ok(widgetBounds.width <= bounds.width, 'Widget fits the initial mobile form width');
        if (process.env.SCREENSHOT_DIR) {
          await field(mobile.page, action).scrollIntoViewIfNeeded();
          await mobile.page.waitForTimeout(1200);
          await mobile.page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/turnstile-${action}-${width}-mobile.png` });
        }
        assert.deepEqual(mobile.errors, []);
        checks++;
        await mobile.context.close();
        }
    }
    const navigation = await setup('/get-a-quote');
    await complete(navigation.page, 'quote');
    const savedToken = await field(navigation.page, 'quote').locator('input').inputValue();
    await navigation.page.setViewportSize({ width: 390, height: 844 });
    await navigation.page.waitForTimeout(200);
    assert.equal(await field(navigation.page, 'quote').locator('input').inputValue(), savedToken, 'Resizing must not restart a solved challenge');
    await navigation.page.setViewportSize({ width: 1440, height: 1000 });
    await navigation.page.evaluate(() => {
      window.__testDocument = 'retained';
      window.__staleQuoteCallbacks = [...window.__turnstileTest.widgets.values()].find(w => w.options.action === 'quote').options;
    });
    for (const [path, action] of [['/contact', 'contact'], ['/get-a-quote', 'quote'], ['/contact', 'contact']]) {
      // The header quote CTA uses router.push; the footer quote anchor performs
      // a full reload and would not exercise the SPA widget lifecycle.
      if (action === 'quote') await navigation.page.locator('button.swn-cta').click();
      else await navigation.page.locator('a.swn-link[href="/contact"]').click();
      await navigation.page.waitForURL('**' + path);
      await field(navigation.page, action).getByRole('button', { name: 'Complete test security check' }).waitFor();
      await navigation.page.waitForFunction(action => {
        const widgets = [...window.__turnstileTest.widgets.values()];
        // The footer is deferred until approached, so it may not be mounted.
        return widgets.filter(w => w.options.action === action).length === 1 &&
          widgets.every(w => w.options.action === action || w.options.action === 'quick_contact') &&
          widgets.filter(w => w.options.action === 'quick_contact').length <= 1;
      }, action);
      assert.equal(await navigation.page.evaluate(() => window.__testDocument), 'retained', 'Exercise Next.js navigation rather than full reloads');
      await complete(navigation.page, action);
      checks++;
    }
    const contactToken = await field(navigation.page, 'contact').locator('input').inputValue();
    await navigation.page.evaluate(() => {
      window.__staleQuoteCallbacks.callback('removed-widget-token');
      window.__staleQuoteCallbacks['error-callback']('600010');
    });
    await navigation.page.waitForTimeout(100);
    assert.equal(await field(navigation.page, 'contact').locator('input').inputValue(), contactToken);
    assert.equal(await field(navigation.page, 'contact').getAttribute('data-turnstile-state'), 'verified');
    assert.equal(navigation.scriptRequests(), 1);
    await event(navigation.page, 'contact', 'error-callback');
    await navigation.page.evaluate(() => [...window.__turnstileTest.widgets.values()].find(w => w.options.action === 'contact').options['error-callback']('600010'));
    await field(navigation.page, 'contact').getByText('code 600010', { exact: false }).waitFor();
    assert.equal(await field(navigation.page, 'contact').getByRole('link', { name: 'Email us' }).getAttribute('href'), 'mailto:info@locator.ae');
    assert.deepEqual(navigation.errors, []);
    checks += 3;
    await navigation.context.close();
    console.log(`Turnstile browser checks passed: ${checks}. Cloudflare and contact success mocked; server-action mail delivery disabled.`);
  } finally { await browser.close(); }
}

const port = 32000 + Math.floor(Math.random() * 10000);
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], {
  env: { ...process.env, TURNSTILE_SECRET_KEY: '' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
});
let started = false;
const timeout = setTimeout(() => { console.error('Local server timeout'); server.kill(); process.exitCode = 1; }, 60000);
server.stdout.on('data', async data => {
  const text = data.toString();
  if (text.includes('Ready') && !started) {
    started = true;
    clearTimeout(timeout);
    try { await check(`http://${process.env.TEST_HOSTNAME || '127.0.0.1'}:${port}`); }
    catch (error) { console.error(error); process.exitCode = 1; }
    finally { server.kill(); }
  }
});
server.stderr.on('data', data => process.stderr.write(data));
server.on('exit', code => { clearTimeout(timeout); if (!started) process.exitCode = code || 1; });
process.on('exit', () => server.kill());
