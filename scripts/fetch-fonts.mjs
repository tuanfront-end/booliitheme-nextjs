// Fetches the Fontshare faces this template is set in — the ones
// app/fontshare.css declares.
//
// They are not in the repo and they are not in the zip you bought, and that is
// a licence requirement rather than an oversight: Indian Type Foundry's Free
// Font License lets anyone use these faces commercially, for free, forever —
// but it does not let anyone pass the files on. Section 02 is explicit that a
// third party "must obtain their own copy directly from Fontshare". This script
// is that copy: it runs on your machine and downloads from fontshare.com to
// your machine, which makes you the licensee rather than the recipient.
//
//   npm run fonts
//
// The template renders correctly without it. Every Fontshare face is declared
// with an SIL Open Font License fallback of the same register, so a build with
// no fonts fetched is a complete, intentional page — just not the one in the
// preview. Read public/fonts/README.md and the licence before you ship a site
// with these faces on it.
//
// No dependencies, on purpose. A postinstall step that reached the network
// would download fonts nobody asked for; a zip library would be a package added
// to a template for one script. The forty lines below read the archive instead.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { inflateRawSync } from "node:zlib";
import { declaredFetchedFaces } from "../lib/fetched-fonts.mjs";

const LICENCE = "https://www.fontshare.com/licenses/itf-ffl";
const OUT = path.join(process.cwd(), "public", "fonts");

// Read out of app/fontshare.css, the same list the dev notice reads, so trimming
// a face from that file trims it here too. The slug is Fontshare's — the family
// name in lower case, hyphenated — and the file is the variable webfont inside
// that family's zip. One file per family covers every weight the face ships,
// which is also what keeps the emphasis step real rather than synthesised by
// the browser.
const FAMILIES = declaredFetchedFaces().map(({ family, file }) => ({
  slug: family.toLowerCase().replace(/\s+/g, "-"),
  file,
}));

// The central directory, read back to front — the only part of a zip whose
// entry sizes are always correct. A streamed archive can leave the local
// headers zeroed and put the real numbers in a trailing data descriptor, so
// walking the file forwards works until the day it silently does not.
function* entries(zip) {
  let eocd = zip.length - 22;
  while (eocd >= 0 && zip.readUInt32LE(eocd) !== 0x06054b50) eocd -= 1;
  if (eocd < 0) throw new Error("not a zip archive");

  let at = zip.readUInt32LE(eocd + 16);
  for (let i = zip.readUInt16LE(eocd + 10); i > 0; i -= 1) {
    const nameLength = zip.readUInt16LE(at + 28);
    const name = zip.subarray(at + 46, at + 46 + nameLength).toString("utf8");
    const method = zip.readUInt16LE(at + 10);
    const compressed = zip.readUInt32LE(at + 20);
    const header = zip.readUInt32LE(at + 42);

    // The local header repeats the name and carries its own extra field, and
    // the two extra fields differ in length often enough to matter.
    const start =
      header + 30 + zip.readUInt16LE(header + 26) + zip.readUInt16LE(header + 28);
    const raw = zip.subarray(start, start + compressed);

    yield { name, read: () => (method === 0 ? raw : inflateRawSync(raw)) };
    at += 46 + nameLength + zip.readUInt16LE(at + 30) + zip.readUInt16LE(at + 32);
  }
}

async function download(slug) {
  const url = `https://api.fontshare.com/v2/fonts/download/${slug}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${slug}: ${response.status} from Fontshare`);
  return Buffer.from(await response.arrayBuffer());
}

if (FAMILIES.length === 0) {
  console.log("No Fontshare face is declared in app/fontshare.css — nothing to fetch.");
  process.exit(0);
}

await mkdir(OUT, { recursive: true });
const count = FAMILIES.length === 1 ? "one face" : `${FAMILIES.length} faces`;
console.log(`Fetching ${count} from fontshare.com under the ITF Free Font\nLicense. Read it before you ship: ${LICENCE}\n`);

let licence = false;
for (const { slug, file } of FAMILIES) {
  const zip = await download(slug);
  let written = false;

  for (const entry of entries(zip)) {
    // Anchored on the separator so a family whose zip grows a second folder
    // cannot match the wrong file on a suffix.
    if (entry.name.endsWith(`/${file}`)) {
      await writeFile(path.join(OUT, file), entry.read());
      written = true;
    }
    // Identical in every archive, so the first one wins and the rest are
    // skipped rather than rewritten.
    if (!licence && entry.name.endsWith("/FFL.txt")) {
      await writeFile(path.join(OUT, "FFL.txt"), entry.read());
      licence = true;
    }
  }

  if (!written) throw new Error(`${slug}: ${file} is no longer in the archive`);
  console.log(`  public/fonts/${file}`);
}

console.log("\nDone. `npm run dev` now renders the faces the preview was built in.");
