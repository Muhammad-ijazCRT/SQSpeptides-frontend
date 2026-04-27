import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "../src/generated/prisma-client";
import * as bcrypt from "bcryptjs";
import type { CatalogProductSeed } from "./catalog-products";

const prisma = new PrismaClient();

function loadCatalogFromProductsJson(): CatalogProductSeed[] {
  const jsonPath = path.resolve(__dirname, "..", "..", "products.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`products.json not found at ${jsonPath} (expected repo root next to backend/)`);
  }
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as unknown;
  if (!Array.isArray(raw)) {
    throw new Error("products.json must contain a JSON array of products");
  }
  return raw as CatalogProductSeed[];
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@sqspeptides.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMeAdmin123!";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash, name: "Administrator" },
    update: { passwordHash, name: "Administrator" },
  });
  console.log(`Seeded admin: ${email} (set ADMIN_EMAIL / ADMIN_PASSWORD to override)`);
}

async function seedCatalogProducts() {
  const catalog = loadCatalogFromProductsJson();
  const [wishlist, lines, cleared, created] = await prisma.$transaction(async (tx) => {
    const w = await tx.wishlistItem.deleteMany({});
    const o = await tx.orderItem.deleteMany({});
    const p = await tx.product.deleteMany({});
    const c = await tx.product.createMany({
      data: catalog.map((row) => ({
        slug: row.slug,
        name: row.name,
        description: row.description,
        price: row.price,
        imageUrl: row.imageUrl,
        rating: row.rating,
      })),
    });
    return [w, o, p, c] as const;
  });
  console.log(
    `Catalog reseed from products.json: removed ${cleared.count} products (${lines.count} order lines, ${wishlist.count} wishlist rows), inserted ${created.count} products`,
  );
}

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", affiliateCommissionPercent: 10 },
    update: {},
  });
  console.log("Seeded site settings (affiliate commission default 10%)");
}

async function main() {
  await seedCatalogProducts();
  await seedSiteSettings();
  await seedAdmin();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
