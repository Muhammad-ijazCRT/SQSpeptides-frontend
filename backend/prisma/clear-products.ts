/**
 * Removes all rows from Product (and dependent WishlistItem + OrderItem rows).
 * Orders remain; their line items are removed. Order totals on Order rows are not recalculated.
 * Run: pnpm exec tsx prisma/clear-products.ts  (from backend/)
 */
import { PrismaClient } from "../src/generated/prisma-client";

const prisma = new PrismaClient();

async function main() {
  const [wishlist, lines, products] = await prisma.$transaction([
    prisma.wishlistItem.deleteMany({}),
    prisma.orderItem.deleteMany({}),
    prisma.product.deleteMany({}),
  ]);

  console.log(
    `Cleared products: ${products.count} products, ${lines.count} order line items, ${wishlist.count} wishlist rows removed.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
