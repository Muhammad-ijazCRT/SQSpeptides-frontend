import { PrismaClient } from "../src/generated/prisma-client";
import * as bcrypt from "bcryptjs";
import { CATALOG_PRODUCTS } from "./catalog-products";

const prisma = new PrismaClient();

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
  for (const p of CATALOG_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        rating: p.rating,
      },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        rating: p.rating,
      },
    });
  }
  console.log(
    `Seeded ${CATALOG_PRODUCTS.length} catalog products (imageUrl paths under /products/images/)`,
  );
}

async function main() {
  await seedCatalogProducts();
  await seedAdmin();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
