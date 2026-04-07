import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../auth/guards/admin-jwt.guard";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "../products/dto/create-product.dto";
import { UpdateProductDto } from "../products/dto/update-product.dto";
import { ProductsService } from "../products/products.service";

@Controller("admin")
@UseGuards(AdminJwtGuard)
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly products: ProductsService
  ) {}

  @Get("overview")
  async overview() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const [
      orderCount,
      productCount,
      customerCount,
      revenueAll,
      ordersToday,
      ordersThisMonth,
      pendingOrders,
      completedOrderCount,
      completedRevenue,
      customersNewToday,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.product.count(),
      this.prisma.customer.count(),
      this.prisma.order.aggregate({ _sum: { total: true } }),
      this.prisma.order.count({
        where: { createdAt: { gte: startOfDay, lt: endOfDay } },
      }),
      this.prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      this.prisma.order.count({ where: { status: "pending" } }),
      this.prisma.order.count({
        where: { OR: [{ status: "completed" }, { status: "shipped" }] },
      }),
      this.prisma.order.aggregate({
        where: { OR: [{ status: "completed" }, { status: "shipped" }] },
        _sum: { total: true },
      }),
      this.prisma.customer.count({
        where: { createdAt: { gte: startOfDay, lt: endOfDay } },
      }),
    ]);

    return {
      orderCount,
      productCount,
      customerCount,
      revenueTotal: Number(revenueAll._sum.total ?? 0),
      ordersToday,
      ordersThisMonth,
      pendingOrders,
      completedOrderCount,
      revenueFromCompleted: Number(completedRevenue._sum.total ?? 0),
      customersNewToday,
    };
  }

  @Get("customers")
  listCustomers() {
    return this.prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  @Get("products")
  listProducts() {
    return this.products.findAll();
  }

  @Post("products")
  createProduct(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @Patch("products/:id")
  updateProduct(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.products.update(id, dto);
  }

  @Delete("products/:id")
  deleteProduct(@Param("id") id: string) {
    return this.products.remove(id);
  }
}
