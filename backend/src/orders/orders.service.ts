import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { Decimal } from "../generated/prisma-client/runtime/library";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";

function serializeOrder(o: {
  id: string;
  email: string;
  fullName: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
  researchUseAttestation: string;
  total: unknown;
  status: string;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    price: unknown;
    product: { id: string; name: string; slug: string; imageUrl: string | null };
  }[];
}) {
  return {
    id: o.id,
    email: o.email,
    fullName: o.fullName,
    addressLine1: o.addressLine1,
    city: o.city,
    postalCode: o.postalCode,
    country: o.country,
    researchUseAttestation: o.researchUseAttestation,
    total: Number(o.total),
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      price: Number(i.price),
      product: i.product,
    })),
  };
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, customerId?: string | null) {
    const creates: { productId: string; quantity: number; price: Decimal }[] = [];
    let totalNum = 0;

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Unknown product: ${item.productId}`);
      }
      const unit = Number(product.price);
      totalNum += unit * item.quantity;
      creates.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await this.prisma.order.create({
      data: {
        customerId: customerId ?? undefined,
        email: dto.email.toLowerCase(),
        fullName: dto.fullName,
        addressLine1: dto.addressLine1,
        city: dto.city,
        postalCode: dto.postalCode,
        country: dto.country,
        researchUseAttestation: dto.researchUseAttestation,
        total: totalNum,
        items: {
          create: creates.map((c) => ({
            productId: c.productId,
            quantity: c.quantity,
            price: c.price,
          })),
        },
      },
    });

    return {
      id: order.id,
      email: order.email,
      total: Number(order.total),
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    };
  }

  async findAll() {
    const rows = await this.prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, imageUrl: true } },
          },
        },
      },
    });
    return rows.map((o) => serializeOrder(o));
  }

  async findMyOrders(customerId: string, email: string) {
    const normalized = email.toLowerCase();
    const rows = await this.prisma.order.findMany({
      where: {
        OR: [
          { customerId },
          {
            AND: [
              { customerId: null },
              { email: { equals: normalized, mode: "insensitive" } },
            ],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, imageUrl: true } },
          },
        },
      },
    });
    return rows.map((o) => serializeOrder(o));
  }

  async findOneForCustomer(orderId: string, customerId: string, email: string) {
    const normalized = email.toLowerCase();
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, imageUrl: true } },
          },
        },
      },
    });
    if (!order) throw new NotFoundException();
    const byAccount = order.customerId === customerId;
    const byGuestEmail =
      order.customerId == null && order.email.toLowerCase() === normalized;
    if (!byAccount && !byGuestEmail) throw new ForbiddenException();
    return serializeOrder(order);
  }
}
