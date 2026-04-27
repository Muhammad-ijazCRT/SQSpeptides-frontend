import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../generated/prisma-client";
import type { CreateProductDto } from "./dto/create-product.dto";
import type { UpdateProductDto } from "./dto/update-product.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const rows = await this.prisma.product.findMany({ orderBy: { name: "asc" } });
    return rows.map((p) => this.serializeProduct(p));
  }

  async findBySlug(slug: string) {
    const p = await this.prisma.product.findUnique({ where: { slug } });
    if (!p) throw new NotFoundException("Product not found");
    return this.serializeProduct(p);
  }

  private slugify(raw: string): string {
    const s = raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return s.length ? s : "product";
  }

  async create(dto: CreateProductDto) {
    const slug = dto.slug?.trim() ? this.slugify(dto.slug) : this.slugify(dto.name);
    const clash = await this.prisma.product.findUnique({ where: { slug } });
    if (clash) throw new ConflictException("A product with this slug already exists");

    const row = await this.prisma.product.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() || null,
        price: new Prisma.Decimal(dto.price),
        imageUrl: dto.imageUrl?.trim() || null,
        rating: dto.rating ?? 5,
      },
    });
    return this.serializeProduct(row);
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Product not found");

    let slug = existing.slug;
    if (dto.slug !== undefined && dto.slug.trim() !== "") {
      slug = this.slugify(dto.slug);
      if (slug !== existing.slug) {
        const clash = await this.prisma.product.findUnique({ where: { slug } });
        if (clash) throw new ConflictException("A product with this slug already exists");
      }
    }

    const row = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        slug,
        ...(dto.description !== undefined ? { description: dto.description.trim() || null } : {}),
        ...(dto.price !== undefined ? { price: new Prisma.Decimal(dto.price) } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl.trim() || null } : {}),
        ...(dto.rating !== undefined ? { rating: dto.rating } : {}),
      },
    });
    return this.serializeProduct(row);
  }

  async remove(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Product not found");
    const slug = existing.slug;
    try {
      await this.prisma.product.delete({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        throw new ConflictException("Cannot delete this product: it is referenced by orders or wishlists.");
      }
      throw e;
    }
    return { ok: true, id, slug };
  }

  private serializeProduct(p: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: { toString(): string };
    imageUrl: string | null;
    rating: number;
  }) {
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      rating: p.rating,
    };
  }
}
