import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const jsonPath = path.join(root, "products.json");
const imgDir = path.join(root, "public", "products", "images");
const catalogOut = path.join(root, "backend", "prisma", "catalog-products.ts");

const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const bySlug = new Map();
for (const p of raw) bySlug.set(p.slug, p);
const prods = [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));

function sanitizeBasename(url) {
  const s = String(url).trim();
  const rest = s.startsWith("/images/")
    ? s.slice("/images/".length)
    : s.startsWith("/products/images/")
      ? s.slice("/products/images/".length)
      : s.replace(/^\//, "");
  const base = rest.split("/").pop() || rest;
  const dot = base.lastIndexOf(".");
  if (dot < 0) return base.replace(/\s/g, "");
  return base.slice(0, dot).replace(/\s/g, "") + base.slice(dot);
}

function sanitizeDiskFilename(filename) {
  const dot = filename.lastIndexOf(".");
  if (dot < 0) return filename.replace(/\s/g, "");
  return filename.slice(0, dot).replace(/\s/g, "") + filename.slice(dot);
}

let files = fs.readdirSync(imgDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

function diskSanKey(f) {
  return sanitizeDiskFilename(f).toLowerCase();
}

/** JSON sanitized basename (lower) -> actual filename currently on disk */
/** Short JSON basenames -> actual files in public/products/images/ (space-free). */
const aliasSanToDisk = {
  klowjpg: "Klow-01.jpg",
  kpvjpg: "KPV-01.jpg",
  "lipo-c-b12jpg": "LIPO-CwB12-01.jpg",
  "mots-cjpg": "Mots-C-01.jpg",
  mt1jpg: "Mt1-01.jpg",
  mt2jpg: "Mt2-01.jpg",
  nadjpg: "NAD500mg-01.jpg",
  selankjpg: "Selank-01.jpg",
  semaxjpg: "Semax-01.jpg",
  "sqs-p4jpg": "SQS-P410-01.jpg",
  "sqs-t1somjpg": "SQS-T1SOM-01.jpg",
  ss31jpg: "SS31-01.jpg",
  "tb500-10mgjpg": "TB50010mg-01.jpg",
  "tb500-5mgjpg": "TB500-01.jpg",
  "test-ejpg": "TestE250legends-01.jpg",
  "glp-r3jpg": "GLP-R3-01.jpg",
  "glp-t2-20jpg": "GLP-T220mg-01.jpg",
  "glp-t2-30jpg": "GLP-T230mg-01.jpg",
  "glp-t2-40jpg": "GLP-T240mg-01.jpg",
  "igf-lr3jpg": "IGFLR3-01.jpg",
};

function resolveDiskFile(p) {
  const wantSan = sanitizeBasename(p.imageUrl);
  const key = wantSan.toLowerCase();
  for (const f of files) {
    if (diskSanKey(f) === key) return f;
  }
  const aliasKey = wantSan.replace(/\./g, "").toLowerCase();
  if (aliasSanToDisk[aliasKey] && files.includes(aliasSanToDisk[aliasKey])) {
    return aliasSanToDisk[aliasKey];
  }
  /** exact filename match (case) */
  if (files.includes(wantSan)) return wantSan;
  const lower = wantSan.toLowerCase();
  const hit = files.find((f) => f.toLowerCase() === lower);
  if (hit) return hit;
  console.warn("No disk file for", p.slug, p.imageUrl, "-> want", wantSan);
  return wantSan;
}

/** 1) Rename every file to space-free basename */
const seenTargets = new Set();
for (const f of [...files]) {
  const to = sanitizeDiskFilename(f);
  if (f === to) continue;
  const fromPath = path.join(imgDir, f);
  const toPath = path.join(imgDir, to);
  if (seenTargets.has(to.toLowerCase())) {
    console.warn("Collision skipping:", f, "->", to);
    continue;
  }
  if (fs.existsSync(toPath) && f.toLowerCase() !== to.toLowerCase()) {
    console.warn("Target exists, skipping:", f, "->", to);
    continue;
  }
  fs.renameSync(fromPath, toPath);
  seenTargets.add(to.toLowerCase());
}

files = fs.readdirSync(imgDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

const rows = [];
for (const p of prods) {
  const source = resolveDiskFile(p);
  const imageFile = sanitizeDiskFilename(source);
  rows.push({
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    rating: p.rating,
    imageFile,
  });
}

const finalFiles = new Set(files);
for (const r of rows) {
  if (!finalFiles.has(r.imageFile)) {
    console.warn("Still missing file:", r.slug, r.imageFile);
  }
}

const jsonOut = rows.map((r) => {
  const p = prods.find((x) => x.slug === r.slug);
  return {
    slug: r.slug,
    name: r.name,
    description: p.description,
    price: r.price,
    imageUrl: `/images/${r.imageFile}`,
    rating: r.rating,
  };
});
fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 4) + "\n", "utf8");

const ts = `/**
 * Catalog rows for Prisma seed. Sync from products.json (dedupe by slug, last wins).
 * Images: public/products/images/ — filenames have no spaces.
 */
export type CatalogProductSeed = {
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
};

function productImageUrl(path: string): string {
  const t = path.trim();
  if (t.startsWith("/products/images/")) return t;
  if (t.startsWith("/images/")) return "/products/images/" + t.slice("/images/".length);
  const f = t.replace(/^\\//, "");
  return "/products/images/" + (f.split("/").pop() ?? f);
}

export const CATALOG_PRODUCTS: CatalogProductSeed[] = [
${rows
  .map(
    (r) => `  {
    slug: ${JSON.stringify(r.slug)},
    name: ${JSON.stringify(r.name)},
    description: ${JSON.stringify(r.description)},
    price: ${r.price},
    imageUrl: productImageUrl(${JSON.stringify("/images/" + r.imageFile)}),
    rating: ${r.rating},
  },`,
  )
  .join("\n")}
];
`;

fs.writeFileSync(catalogOut, ts, "utf8");
console.log("Wrote", path.relative(root, catalogOut));
console.log("Updated products.json,", rows.length, "products");
