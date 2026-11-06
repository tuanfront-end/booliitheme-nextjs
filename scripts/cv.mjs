// Prints /cv to the PDF the home page hands out, and its first page to the
// picture the CV panel shows. It reads a running production server, since a dev
// server draws its own overlays into the print:
//
//   npm run build && npm run start      # in one terminal
//   npm run cv                          # in another; or `npm run cv -- <url>`
//
// macOS only: Chrome prints the PDF, Quick Look draws the picture.

import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const pdf = "public/booliitheme-cv.pdf";

// Headless Chrome on macOS can exit non-zero on teardown after the file is
// written, so success is a PDF newer than the start of this run.
const started = Date.now();
spawnSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--virtual-time-budget=4000",
  `--print-to-pdf=${pdf}`,
  `${base}/cv`,
], { stdio: "ignore" });
if ((statSync(pdf, { throwIfNoEntry: false })?.mtimeMs ?? 0) < started) throw new Error(`cv: Chrome wrote no PDF from ${base}/cv`);

const out = mkdtempSync(join(tmpdir(), "cv-"));
execFileSync("qlmanage", ["-t", "-s", "1240", "-o", out, pdf], { stdio: "ignore" });
// Copied, not moved: the temp folder can sit on another volume.
copyFileSync(join(out, "booliitheme-cv.pdf.png"), "images/cv.png");
rmSync(out, { recursive: true, force: true });

console.log(`cv: ${pdf} and images/cv.png written from ${base}/cv`);
