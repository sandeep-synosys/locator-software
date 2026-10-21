// Run with: node --test scripts/turnstile.test.cjs
// All Cloudflare requests and mail delivery are mocked; this never sends email.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks = {}, globals = {}, expose = '') {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code + expose, { exports, require: id => {
    if (!(id in mocks)) throw Error('Unexpected dependency: ' + id);
    return mocks[id];
  }, FormData, Request, Response, File, Buffer, URLSearchParams, AbortSignal,
  console: { ...console, error() {} }, ...globals }, { filename: file });
  return exports;
}

function loaderFixture() {
  const scripts = [];
  const window = { setTimeout: () => 1 };
  const api = load('src/components/common/TurnstileField.tsx', { react: {}, 'react/jsx-runtime': {}, 'next/navigation': {}, '@/config/site': {} }, {
    window, clearTimeout() {}, document: {
      createElement: () => ({ remove() { this.removed = true; } }),
      head: { appendChild: script => scripts.push(script) },
    },
  }, '\nexports.loadTurnstile = loadTurnstile;');
  return { ...api, scripts, window };
}

test('async SDK loading uses its explicit callback, shares pending loads and never calls ready()', async () => {
  const api = loaderFixture();
  const first = api.loadTurnstile();
  const script = api.scripts[0];
  assert.equal(script.async, true);
  const callback = new URL(script.src).searchParams.get('onload');
  assert.ok(callback, 'Async loading must register the SDK onload callback');
  assert.equal(typeof api.window[callback], 'function');
  api.window.turnstile = { ready() { throw Error('ready() cannot be used with async/defer'); }, render() {}, remove() {} };
  const second = api.loadTurnstile();
  assert.equal(second, first, 'Do not use a partially initialized SDK before its callback');
  api.window[callback]();
  assert.equal(await first, api.window.turnstile);
  assert.equal(await second, api.window.turnstile);
  assert.equal(await api.loadTurnstile(), api.window.turnstile);
  assert.equal(api.scripts.length, 1);
});

test('failed SDK loads remove their callback and allow a new shared retry', async () => {
  const api = loaderFixture();
  const first = api.loadTurnstile();
  const rejected = assert.rejects(first, /Security check unavailable/);
  const firstScript = api.scripts[0];
  const firstCallback = new URL(firstScript.src).searchParams.get('onload');
  firstScript.onerror();
  await rejected;
  assert.equal(firstScript.removed, true);
  assert.equal(api.window[firstCallback], undefined);
  const retry = api.loadTurnstile();
  assert.equal(api.loadTurnstile(), retry);
  api.window.turnstile = { render() {}, remove() {} };
  const callback = new URL(api.scripts[1].src).searchParams.get('onload');
  api.window[callback]();
  assert.equal(await retry, api.window.turnstile);
  assert.equal(api.scripts.length, 2);
});
const configured = {
  TURNSTILE_SECRET_KEY: 'private-test-fixture', NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'public-test-fixture',
  TURNSTILE_ALLOWED_HOSTNAMES: 'locator.ae, www.locator.ae', SITE_ENV: 'production',
  CONTACT_RECIPIENT_EMAIL: 'recipient@example.invalid', QUOTE_RECIPIENT_EMAIL: 'recipient@example.invalid',
};
function setup(env = {}, reply = { success: true, action: 'contact', hostname: 'locator.ae' }) {
  const calls = [];
  const process = { env: { ...configured, ...env } };
  const api = load('src/lib/turnstile.ts', { 'server-only': {} }, {
    process, fetch: async (url, options) => {
      calls.push({ url, options });
      if (reply instanceof Error) throw reply;
      if (typeof reply === 'function') return reply(url, options);
      return Response.json(reply);
    },
  });
  return { ...api, calls, process };
}
function form(token = 'valid-fixture-token') {
  const data = new FormData();
  for (const [name, value] of Object.entries({ name: 'Test Enquiry', email: 'person@example.invalid',
    phone: '+971000000000', message: 'Mock delivery only', topic: 'Sales & pricing',
    date: '2026-10-20', time: '10:00', consent: 'on' })) data.set(name, value);
  if (token !== null) data.set('cf-turnstile-response', token);
  return data;
}

const jobs = load('src/components/about/career/jobs-data.ts');
function careerForm(token = 'valid-fixture-token') {
  const data = form(token);
  for (const [key, value] of Object.entries({ jobSlug: jobs.JOBS[0].slug,
    firstName: 'Test', lastName: 'Applicant', countryCode: '+971', phone: '0500000000',
    onsite: 'Yes', salary: 'AED 3000', screening: 'yes' })) data.set(key, value);
  data.set('resume', new File(['Mock resume contents'], 'resume.pdf', { type: 'application/pdf' }));
  return data;
}

test('missing, empty, file and oversized tokens fail before requesting Cloudflare', async () => {
  const api = setup();
  for (const token of [null, '', ' ', 'x'.repeat(2049), new File(['x'], 'token.txt')]) {
    assert.equal((await api.verifyTurnstile(form(token), 'contact')).success, false);
  }
  assert.equal(api.calls.length, 0);
});
test('missing configuration and production test keys fail closed without a network request', async () => {
  for (const env of [{ TURNSTILE_SECRET_KEY: '' }, { NEXT_PUBLIC_TURNSTILE_SITE_KEY: '' },
    { TURNSTILE_ALLOWED_HOSTNAMES: '' }, { TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA' },
    { NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA' }]) {
    const api = setup(env);
    assert.equal((await api.verifyTurnstile(form(), 'contact')).success, false);
    assert.equal(api.calls.length, 0);
  }
});

test('official development keys still require Cloudflare success and are blocked in every production build', async () => {
  const pair = { NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
    TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
    TURNSTILE_ALLOWED_HOSTNAMES: 'localhost,127.0.0.1', SITE_ENV: 'development', NODE_ENV: 'development' };
  const development = setup(pair, { success: true, hostname: 'example.com' });
  assert.equal((await development.verifyTurnstile(form('XXXX.DUMMY.TOKEN.XXXX'), 'quote')).success, true);
  assert.equal(development.calls.length, 1, 'Development test mode must still call Siteverify');
  assert.equal((await setup(pair, { success: false }).verifyTurnstile(form(), 'quote')).success, false);
  for (const env of [{ NODE_ENV: 'production' }, { SITE_ENV: 'production' },
    { NODE_ENV: 'production', SITE_ENV: 'beta' }, { TURNSTILE_SECRET_KEY: 'real-key-fixture' }]) {
    const blocked = setup({ ...pair, ...env }, { success: true, hostname: 'example.com' });
    assert.equal((await blocked.verifyTurnstile(form(), 'quote')).success, false);
    assert.equal(blocked.calls.length, 0);
  }
});
test('valid verification checks exact form action and allowed hostname', async () => {
  const api = setup();
  assert.equal((await api.verifyTurnstile(form(), 'contact')).success, true);
  const { url, options } = api.calls[0];
  assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  assert.equal(options.method, 'POST');
  assert.equal(options.cache, 'no-store');
  assert.equal(options.body.get('response'), 'valid-fixture-token');
  assert.equal(options.body.get('secret'), configured.TURNSTILE_SECRET_KEY);
  assert.ok(options.signal instanceof AbortSignal);
  assert.deepEqual([...options.body.keys()].sort(), ['response', 'secret']);
});
test('invalid, expired, reused, malformed, wrong-action and wrong-host responses never verify', async () => {
  for (const reply of [null, {}, { success: 'true', action: 'contact', hostname: 'locator.ae' },
    { success: false, 'error-codes': ['timeout-or-duplicate'] },
    { success: false, 'error-codes': ['invalid-input-response'] },
    { success: true, action: 'quote', hostname: 'locator.ae' },
    { success: true, action: 'contact', hostname: 'locator.ae.evil.example' },
    { success: true, action: 'contact' },
    new Error('timeout'), () => new Response('service unavailable', { status: 503 }),
    () => new Response('invalid json')]) {
    assert.equal((await setup({}, reply).verifyTurnstile(form(), 'contact')).success, false);
  }
});
test('each delivery entry point denies invalid verification and sends only after successful verification', async () => {
  const handlers = [
    ['src/app/actions/send-quote-email.ts', 'sendQuoteEmail', 'quote-request', 'quoteRequestTemplate', 'quote'],
    ['src/app/actions/send-demo-email.ts', 'sendDemoEmail', 'demo-request', 'demoRequestTemplate', 'demo'],
    ['src/app/actions/send-quick-contact.ts', 'sendQuickContact', 'quick-message', 'quickMessageTemplate', 'quick_contact'],
    ['src/app/api/contact/route.ts', 'POST', 'contact-message', 'contactMessageTemplate', 'contact'],
    ['src/app/api/career-application/route.ts', 'POST', 'career-application', 'careerApplicationTemplate', 'career_application'],
  ];
  for (const [file, fn, template, templateFn, action] of handlers) {
    let deliveries = 0;
    let redeemed = false;
    const api = setup({}, (_url, options) => {
      if (options.body.get('response') !== 'valid-fixture-token' || redeemed) return Response.json({ success: false });
      redeemed = true;
      return Response.json({ success: true, action, hostname: 'locator.ae' });
    });
    const handler = load(file, {
      '@/lib/turnstile': api,
      '@/components/about/career/jobs-data': jobs,
      '@/lib/email/send-mail': { sendMail: async () => { deliveries++; } },
      [`@/lib/email/templates/${template}`]: { [templateFn]: () => '<p>Mocked</p>' },
    }, { process: api.process });
    async function submit(token) {
      if (fn !== 'POST') return handler[fn]({ success: false }, form(token));
      const body = action === 'career_application' ? careerForm(token) : form(token);
      const response = await handler.POST(new Request('http://localhost/api/' + (action === 'career_application' ? 'career-application' : 'contact'), { method: 'POST', body }));
      return response.json();
    }
    assert.equal((await submit(null)).success, false, file);
    assert.equal((await submit('invalid')).success, false, file);
    assert.equal(deliveries, 0, file);
    assert.equal((await submit('valid-fixture-token')).success, true, file);
    assert.equal(deliveries, 1, file);
    assert.equal((await submit('valid-fixture-token')).success, false, 'Reused token: ' + file);
    assert.equal(deliveries, 1, file);
  }
});
test('Cloudflare outage blocks every mail entry point', async () => {
  let deliveries = 0;
  const api = setup({}, new Error('Network unavailable'));
  const mocks = { '@/lib/turnstile': api, '@/lib/email/send-mail': { sendMail: async () => { deliveries++; } } };
  for (const [file, fn, template, templateFn] of [
    ['send-quote-email', 'sendQuoteEmail', 'quote-request', 'quoteRequestTemplate'],
    ['send-demo-email', 'sendDemoEmail', 'demo-request', 'demoRequestTemplate'],
    ['send-quick-contact', 'sendQuickContact', 'quick-message', 'quickMessageTemplate'],
  ]) {
    const handler = load(`src/app/actions/${file}.ts`, { ...mocks,
      [`@/lib/email/templates/${template}`]: { [templateFn]: () => '<p>Mock</p>' } }, { process: api.process });
    assert.equal((await handler[fn]({ success: false }, form())).success, false);
  }
  const contact = load('src/app/api/contact/route.ts', { ...mocks,
    '@/lib/email/templates/contact-message': { contactMessageTemplate: () => '<p>Mock</p>' } }, { process: api.process });
  assert.equal((await (await contact.POST(new Request('http://localhost/api/contact', { method: 'POST', body: form() }))).json()).success, false);
  assert.equal(deliveries, 0);
});

test('career applications reject failed verification, wrong actions/hostnames and missing configuration before sending resumes', async () => {
  for (const [env, reply] of [
    [{}, { success: false, 'error-codes': ['timeout-or-duplicate'] }],
    [{}, { success: true, action: 'contact', hostname: 'locator.ae' }],
    [{}, { success: true, action: 'career_application', hostname: 'other.example' }],
    [{}, new Error('Cloudflare unavailable')],
    [{ TURNSTILE_SECRET_KEY: '' }, { success: true, action: 'career_application', hostname: 'locator.ae' }],
  ]) {
    let deliveries = 0;
    const api = setup(env, reply);
    const handler = load('src/app/api/career-application/route.ts', {
      '@/lib/turnstile': api, '@/components/about/career/jobs-data': jobs,
      '@/lib/email/send-mail': { sendMail: async () => { deliveries++; } },
      '@/lib/email/templates/career-application': { careerApplicationTemplate: () => '<p>Mock</p>' },
    }, { process: api.process });
    const response = await handler.POST(new Request('http://localhost/api/career-application', { method: 'POST', body: careerForm() }));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
    assert.equal(deliveries, 0);
  }
});

test('verified career applications retain resume delivery and safely report email failure', async () => {
  const api = setup({}, { success: true, action: 'career_application', hostname: 'locator.ae' });
  let failMail = true;
  const messages = [];
  const handler = load('src/app/api/career-application/route.ts', {
    '@/lib/turnstile': api, '@/components/about/career/jobs-data': jobs,
    '@/lib/email/send-mail': { sendMail: async message => { messages.push(message); if (failMail) throw Error('Mock mail failure'); } },
    '@/lib/email/templates/career-application': { careerApplicationTemplate: () => '<p>Mock application</p>' },
  }, { process: api.process });
  let attempt = 0;
  const submit = () => handler.POST(new Request('http://localhost/api/career-application', { method: 'POST', body: careerForm('career-fixture-token-' + ++attempt) }));
  assert.equal((await submit()).status, 500);
  failMail = false;
  const response = await submit();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(messages[1].attachments[0].filename, 'resume.pdf');
  assert.equal(messages[1].attachments[0].content.toString(), 'Mock resume contents');
  assert.equal(messages[1].replyTo, 'person@example.invalid');
});
