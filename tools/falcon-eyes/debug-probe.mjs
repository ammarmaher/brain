/*** Falcon Eyes debug probe — spins up Playwright, navigates to destination,
     captures console errors + network failures + final URL + DOM snippet,
     then prints to stdout. Throwaway, not committed. ***/
import { chromium } from '@playwright/test';

const url = process.argv[2] || 'http://localhost:4200/admin-console/org-hierarchy-page?visual-test=1';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleLogs = [];
const requestFailures = [];
const networkResponses = [];

page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
page.on('requestfailed', req => requestFailures.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`));
page.on('response', res => {
  if (res.status() >= 400) {
    networkResponses.push(`${res.status()} ${res.url()}`);
  }
});

try {
  /*** Plan A — Visual-test bypass via addInitScript:
       1) seed sessionStorage('falcon-visual-test'='1') BEFORE any script runs
          → both auth.guard and shell-access.guard honor this on every check
       2) seed a synthetic JWT in sessionStorage with far-future expiry
          → AuthService.authenticated → tokenStorage.hasValidAccessToken()
          jwt_decode only checks the `exp` claim (no signature verify)
       This avoids any source edits or real Identity backend. ***/
  const farFutureExp = Math.floor(Date.now() / 1000) + (365 * 24 * 3600); // +1y
  const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64')
    .replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const header = b64url({ alg: 'none', typ: 'JWT' });
  const payload = b64url({
    sub: 'falcon-eyes-night-shift',
    name: 'Falcon Eyes Tester',
    iat: Math.floor(Date.now() / 1000),
    exp: farFutureExp,
    userType: 'FalconUser',
  });
  const fakeJwt = `${header}.${payload}.test-signature-not-validated`;

  await ctx.addInitScript(({ jwt }) => {
    try {
      /*** Pin the bypass keys: protect from clearTokens/removeItem during app boot. ***/
      const PROTECTED = new Set(['falcon-visual-test', 'access_token']);
      const realSet = sessionStorage.setItem.bind(sessionStorage);
      const realRemove = sessionStorage.removeItem.bind(sessionStorage);
      const realClear = sessionStorage.clear.bind(sessionStorage);

      realSet('falcon-visual-test', '1');
      realSet('access_token', jwt);

      sessionStorage.removeItem = function (key) {
        if (PROTECTED.has(key)) return;
        return realRemove(key);
      };
      sessionStorage.clear = function () {
        const visual = sessionStorage.getItem('falcon-visual-test');
        const token = sessionStorage.getItem('access_token');
        realClear();
        if (visual !== null) realSet('falcon-visual-test', visual);
        if (token !== null) realSet('access_token', token);
      };
      sessionStorage.setItem = function (key, val) {
        if (key === 'access_token' && val == null) return;
        return realSet(key, val);
      };

      /*** Track + BLOCK programmatic navigations to /login.
           Any redirect to login during Falcon Eyes is the unauth fallback —
           swallow it so we stay on the requested route. ***/
      window.__FALCON_NAV_LOG__ = [];
      const origPushState = history.pushState;
      const origReplaceState = history.replaceState;
      const isLoginUrl = (u) => typeof u === 'string' && /(^|\/|#)\/?login(\/|$|\?)/.test(u);
      history.pushState = function (state, title, url) {
        const stack = new Error().stack?.split('\n').slice(2, 10).join(' | ');
        window.__FALCON_NAV_LOG__.push({ kind: 'push', url, blocked: isLoginUrl(url), stack });
        if (isLoginUrl(url)) return;
        return origPushState.apply(this, arguments);
      };
      history.replaceState = function (state, title, url) {
        const stack = new Error().stack?.split('\n').slice(2, 10).join(' | ');
        window.__FALCON_NAV_LOG__.push({ kind: 'replace', url, blocked: isLoginUrl(url), stack });
        if (isLoginUrl(url)) return;
        return origReplaceState.apply(this, arguments);
      };

      window.__FALCON_EYES_BYPASS__ = { jwt, ts: Date.now() };
    } catch (e) { console.log('[FALCON-EYES-BYPASS] failed', e); }
  }, { jwt: fakeJwt });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  /*** Decode JWT in browser using same library Angular uses, to compare. ***/
  const jwtCheck = await page.evaluate(() => {
    const token = sessionStorage.getItem('access_token');
    if (!token) return { token: null };
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const expMs = payload.exp * 1000;
      return {
        tokenLen: token.length,
        exp: payload.exp,
        expReadable: new Date(expMs).toISOString(),
        nowMs: Date.now(),
        valid: expMs > Date.now(),
        sub: payload.sub,
      };
    } catch (e) { return { decodeError: String(e) }; }
  });
  console.log('=== JWT DECODE CHECK ===');
  console.log(JSON.stringify(jwtCheck, null, 2));
  const navLog = await page.evaluate(() => window.__FALCON_NAV_LOG__ || []);
  console.log('=== NAVIGATION LOG (first 20) ===');
  console.log(JSON.stringify(navLog.slice(0, 20), null, 2));
  /*** Post-navigation sessionStorage state ***/
  const ss = await page.evaluate(() => ({
    visualTest: sessionStorage.getItem('falcon-visual-test'),
    accessToken: sessionStorage.getItem('access_token'),
    accessTokenLen: (sessionStorage.getItem('access_token') || '').length,
    hrefAtCheck: window.location.href,
    bypass: window.__FALCON_EYES_BYPASS__,
  }));
  console.log('=== SESSIONSTORAGE STATE ===');
  console.log(JSON.stringify(ss, null, 2));
  const finalUrl = page.url();
  const title = await page.title();
  const bodyText = (await page.locator('body').innerText()).slice(0, 400);
  const mainContent = await page.locator('main, .main-content, router-outlet ~ *').first().innerHTML().catch(() => '(no main found)');
  const hasMenuComponent = await page.locator('app-org-hierarchy-page-menu').count();
  const allCustomElements = await page.evaluate(() => Array.from(document.querySelectorAll('*')).map(e => e.tagName).filter(t => t.includes('-')).slice(0, 50));

  console.log('=== FINAL URL ===');
  console.log(finalUrl);
  console.log('=== TITLE ===');
  console.log(title);
  console.log('=== app-org-hierarchy-page-menu COUNT ===');
  console.log(hasMenuComponent);
  console.log('=== BODY TEXT (first 400 chars) ===');
  console.log(bodyText);
  console.log('=== CUSTOM ELEMENTS PRESENT (first 50) ===');
  console.log(JSON.stringify(allCustomElements, null, 2));
  console.log('=== MAIN INNER HTML (first 800 chars) ===');
  console.log(mainContent.slice(0, 800));
  console.log('=== CONSOLE LOGS (last 30) ===');
  console.log(consoleLogs.slice(-30).join('\n'));
  console.log('=== REQUEST FAILURES ===');
  console.log(requestFailures.join('\n') || '(none)');
  console.log('=== 4xx/5xx RESPONSES (all) ===');
  console.log(networkResponses.join('\n') || '(none)');
} finally {
  await browser.close();
}
