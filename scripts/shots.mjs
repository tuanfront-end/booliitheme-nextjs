// Captures every template's live demo, as the cards and the open template show
// it: the desktop on a 1440 × 900 screen, taken 1800 tall — taller than any
// card's window, so the window never reaches the capture's foot, while
// a hero sized to the screen keeps the screen's height — and the phone at
// 390 × 844, drawn at twice the density. Written over images/live/, the files
// lib/data/projects.ts imports.
//
//   npm run shots                 # every template
//   npm run shots -- ofen saal    # just these slugs
//
// macOS: Chrome draws the pages over its DevTools protocol, sips turns them
// into JPEGs. Node 22 or later, for the built-in WebSocket.

import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;

// slug → demo URL, read off the data file rather than kept twice.
const source = readFileSync("lib/data/projects.ts", "utf8");
const demos = [...source.matchAll(/slug: "([^"]+)"[\s\S]*?demo: "([^"]+)"/g)].map(([, slug, url]) => ({ slug, url }));
const only = process.argv.slice(2);
const todo = only.length ? demos.filter((d) => only.includes(d.slug)) : demos;

const screens = [
  { name: "desktop", width: 1440, height: 900, take: 1800, scale: 1, mobile: false },
  { name: "mobile", width: 390, height: 844, take: 844, scale: 2, mobile: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "shots-"));
const browser = spawn(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`], {
  stdio: "ignore",
});

async function target() {
  for (let i = 0; i < 50; i++) {
    try {
      return await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
    } catch {
      await sleep(200);
    }
  }
  throw new Error("shots: Chrome never opened its debugging port");
}

function session(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const waiting = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    waiting.get(msg.id)?.(msg);
    waiting.delete(msg.id);
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      waiting.set(n, (msg) => (msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)));
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  return new Promise((resolve) => (ws.onopen = () => resolve({ send, close: () => ws.close() })));
}

try {
  for (const { slug, url } of todo) {
    for (const s of screens) {
      const tab = await target();
      const cdp = await session(tab.webSocketDebuggerUrl);
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width: s.width,
        height: s.height,
        deviceScaleFactor: s.scale,
        mobile: s.mobile,
      });
      await cdp.send("Page.enable");
      await cdp.send("Page.navigate", { url });
      await sleep(6000);
      // Down the page and back, so what reveals itself on scroll has revealed.
      await cdp.send("Runtime.evaluate", {
        expression: `(async () => { for (let y = 0; y <= ${s.take}; y += 300) { scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } scrollTo(0, 0); })()`,
        awaitPromise: true,
      });
      await sleep(2500);
      const { data } = await cdp.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: s.width, height: s.take, scale: 1 },
      });
      cdp.close();
      await fetch(`http://127.0.0.1:${PORT}/json/close/${tab.id}`).catch(() => {});
      const png = join(profile, `${slug}-${s.name}.png`);
      writeFileSync(png, Buffer.from(data, "base64"));
      execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "82", png, "--out", `images/live/${slug}-${s.name}.jpg`], {
        stdio: "ignore",
      });
      console.log(`shots: images/live/${slug}-${s.name}.jpg`);
    }
  }
} finally {
  browser.kill();
  await sleep(500);
  rmSync(profile, { recursive: true, force: true });
}
