// Headless smoke test for the game. Serves the repo root, drives the game via the
// window.__DODGE__ debug handle, and fails on any page error or broken flow.
//
// Run locally:  npm install --no-save playwright && npx playwright install chromium
//               node scripts/smoke-test.js
// (If Chromium lives elsewhere, point CHROMIUM_PATH at the binary.)
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 8123;
const MIME = { '.html': 'text/html', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json' };

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const p = path.join(ROOT, rel);
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(data);
  });
});

const failures = [];
function check(name, ok, detail) {
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
  if (!ok) failures.push(name);
}

(async () => {
  await new Promise(r => server.listen(PORT, r));
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const page = await browser.newPage({ viewport: { width: 1024, height: 640 } });
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') pageErrors.push('console: ' + m.text()); });

  try {
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'load' });
    await page.waitForTimeout(3000);                       // splash auto-dismisses at 2.5s

    check('intro overlay visible', await page.evaluate(() =>
      !document.getElementById('overlayIntro').classList.contains('hidden')));

    // start and soak 60 simulated seconds across the early levels (invulnerable so
    // the soak is deterministic — this exercises spawning, movement, scoring, HUD)
    await page.click('#btnPlayH');
    await page.waitForTimeout(200);
    check('game starts', await page.evaluate(() => window.__DODGE__.S.mode === 'playing'));
    const soak = await page.evaluate(() => {
      const D = window.__DODGE__;
      for (let i = 0; i < 60 * 60; i++) { D.S.invuln = 5; D.step(1 / 60); }
      return { level: D.S.level, score: Math.floor(D.S.score), obs: D.S.obs.length };
    });
    check('60s soak reaches level 2+', soak.level >= 2, JSON.stringify(soak));

    // late-game patterns: weaver + express telegraph at level 6
    const late = await page.evaluate(() => {
      const D = window.__DODGE__;
      D.S.level = 6; D.S.transition = 0; D.S.obs = [];
      let weaver = false, telegraph = false;
      for (let i = 0; i < 60 * 30; i++) {
        D.S.invuln = 5; D.S.time = Math.max(D.S.time, 5); D.step(1 / 60);
        if (D.S.obs.some(o => o.pattern === 'weaver')) weaver = true;
        if (D.S.obs.some(o => o.pattern === 'express' && o.warn > 0)) telegraph = true;
        if (weaver && telegraph) break;
      }
      return { weaver, telegraph };
    });
    check('weaver pattern spawns at level 6', late.weaver);
    check('express telegraph appears', late.telegraph);

    // coin chains spawn and are collectable
    const coins = await page.evaluate(() => {
      const D = window.__DODGE__;
      D.S.cash = []; D.spawnCash();
      const spawned = D.S.cash.length;
      // teleport Mike onto the first coin and step until it's grabbed
      const before = D.S.coinsGot;
      for (let i = 0; i < 120 && D.S.cash.length; i++) {
        const c0 = D.S.cash[0];
        D.player.x = c0.x - D.player.w / 2; D.player.y = c0.y - D.player.h / 2;
        D.S.invuln = 5; D.step(1 / 60);
      }
      return { spawned, got: D.S.coinsGot - before };
    });
    check('coin chain spawns 3+ coins', coins.spawned >= 3, JSON.stringify(coins));
    check('coins are collectable', coins.got >= 1, JSON.stringify(coins));

    // boss arrives in the boss window at level 5, hovers, and fires shots
    const boss = await page.evaluate(() => {
      const D = window.__DODGE__;
      D.S.level = 5; D.S.transition = 0; D.S.time = 11; D.S.boss = null; D.S.bossSpawned = false; D.S.shots = [];
      let appeared = false, fired = false;
      for (let i = 0; i < 60 * 8; i++) {
        D.S.invuln = 5; D.S.time = Math.max(D.S.time, 3); D.step(1 / 60);
        if (D.S.boss) appeared = true;
        if (D.S.shots.length > 0) fired = true;
        if (appeared && fired) break;
      }
      return { appeared, fired };
    });
    check('boss appears at level 5', boss.appeared);
    check('boss fires shots', boss.fired);

    // clearing the level clock removes the boss and counts it as survived
    const cleared = await page.evaluate(() => {
      const D = window.__DODGE__;
      const survivedBefore = D.S.bossesSurvived;
      D.S.time = 0.01; D.S.invuln = 5; D.step(0.02);
      return { boss: D.S.boss, survived: D.S.bossesSurvived - survivedBefore, level: D.S.level };
    });
    check('boss clears on level end', cleared.boss === null && cleared.survived >= 1, JSON.stringify(cleared));

    // pause -> resume shows the countdown
    await page.keyboard.press('p');
    await page.waitForTimeout(100);
    await page.click('#btnResume');
    await page.waitForTimeout(200);
    check('resume countdown active', await page.evaluate(() => window.__DODGE__.S.countdown > 0));
    await page.waitForTimeout(3500);

    // forced loss -> game over overlay
    await page.evaluate(() => { const D = window.__DODGE__; D.S.lives = 1; D.S.invuln = 0; D.S.shield = 0; D.hit(); });
    await page.waitForTimeout(200);
    check('loss shows game over card', await page.evaluate(() =>
      window.__DODGE__.S.mode === 'over' &&
      !document.getElementById('overlayGameOver').classList.contains('hidden')));

    // forced win -> victory cinematic -> stats card with 10/10
    await page.click('#btnAgain');
    await page.waitForTimeout(200);
    await page.evaluate(() => { const D = window.__DODGE__; D.S.level = 10; D.S.time = 0.01; D.S.transition = 0; D.step(0.02); });
    check('win enters victory cinematic', await page.evaluate(() => window.__DODGE__.S.mode === 'victory'));
    await page.evaluate(() => { window.__DODGE__.V.t = 8.95; });   // fast-forward to auto-finish
    await page.waitForTimeout(600);
    check('victory lands on stats card', await page.evaluate(() =>
      window.__DODGE__.S.mode === 'over' &&
      !document.getElementById('overlayGameOver').classList.contains('hidden')));
    check('victory stats say 10/10', await page.evaluate(() =>
      document.getElementById('goStats').textContent.includes('10/10')));

    check('zero page errors', pageErrors.length === 0, pageErrors.join(' | '));
  } catch (e) {
    failures.push('unhandled: ' + e.message);
    console.error(e);
  }

  if (failures.length) {
    await page.screenshot({ path: path.join(ROOT, 'smoke-failure.png') }).catch(() => {});
  }
  await browser.close();
  server.close();
  console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nAll smoke checks passed');
  process.exit(failures.length ? 1 : 0);
})();
