import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "../generated/prisma-client";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateAddressDto, UpdateAddressDto } from "./dto/address.dto";
import type { CreatePaymentMethodDto, UpdatePaymentMethodDto } from "./dto/payment-method.dto";
import type { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class CustomerPortalService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(customerId: string, dto: UpdateProfileDto) {
    return this.prisma.customer.update({
      where: { id: customerId },
      data: { name: dto.name.trim() },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  async listAddresses(customerId: string) {
    return this.prisma.customerAddress.findMany({
      where: { customerId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });
  }

  async createAddress(customerId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.prisma.customerAddress.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }
    return this.prisma.customerAddress.create({
      data: {
        customerId,
        label: dto.label.trim(),
        fullName: dto.fullName.trim(),
        line1: dto.line1.trim(),
        city: dto.city.trim(),
        postalCode: dto.postalCode.trim(),
        country: dto.country.trim(),
        isDefault: dto.isDefault ?? false,
      },
    });
  }

  async updateAddress(customerId: string, addressId: string, dto: UpdateAddressDto) {
    const existing = await this.prisma.customerAddress.findFirst({
      where: { id: addressId, customerId },
    });
    if (!existing) throw new NotFoundException("Address not found");
    if (dto.isDefault) {
      await this.prisma.customerAddress.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }
    return this.prisma.customerAddress.update({
      where: { id: addressId },
      data: {
        ...(dto.label !== undefined && { label: dto.label.trim() }),
        ...(dto.fullName !== undefined && { fullName: dto.fullName.trim() }),
        ...(dto.line1 !== undefined && { line1: dto.line1.trim() }),
        ...(dto.city !== undefined && { city: dto.city.trim() }),
        ...(dto.postalCode !== undefined && { postalCode: dto.postalCode.trim() }),
        ...(dto.country !== undefined && { country: dto.country.trim() }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
    });
  }

  async deleteAddress(customerId: string, addressId: string) {
    const existing = await this.prisma.customerAddress.findFirst({
      where: { id: addressId, customerId },
    });
    if (!existing) throw new NotFoundException("Address not found");
    await this.prisma.customerAddress.delete({ where: { id: addressId } });
    return { ok: true };
  }

  async listWishlist(customerId: string) {
    const rows = await this.prisma.wishlistItem.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      include: {
        product: true,
      },
    });
    return rows.map((w) => ({
      id: w.id,
      createdAt: w.createdAt.toISOString(),
      product: {
        id: w.product.id,
        slug: w.product.slug,
        name: w.product.name,
        description: w.product.description,
        price: Number(w.product.price),
        imageUrl: w.product.imageUrl,
        rating: w.product.rating,
      },
    }));
  }

  async addWishlist(customerId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException("Product not found");
    try {
      await this.prisma.wishlistItem.create({
        data: { customerId, productId },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("Already in wishlist");
      }
      throw e;
    }
    return { ok: true };
  }

  async removeWishlist(customerId: string, productId: string) {
    await this.prisma.wishlistItem.deleteMany({
      where: { customerId, productId },
    });
    return { ok: true };
  }

  async listPaymentMethods(customerId: string) {
    return this.prisma.savedPaymentMethod.findMany({
      where: { customerId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  async createPaymentMethod(customerId: string, dto: CreatePaymentMethodDto) {
    if (dto.isDefault) {
      await this.prisma.savedPaymentMethod.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }
    return this.prisma.savedPaymentMethod.create({
      data: {
        customerId,
        label: dto.label.trim(),
        brand: dto.brand.trim(),
        last4: dto.last4,
        expMonth: dto.expMonth,
        expYear: dto.expYear,
        isDefault: dto.isDefault ?? false,
      },
    });
  }

  async updatePaymentMethod(
    customerId: string,
    id: string,
    dto: UpdatePaymentMethodDto
  ) {
    const existing = await this.prisma.savedPaymentMethod.findFirst({
      where: { id, customerId },
    });
    if (!existing) throw new NotFoundException("Payment method not found");
    if (dto.isDefault) {
      await this.prisma.savedPaymentMethod.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }
    return this.prisma.savedPaymentMethod.update({
      where: { id },
      data: {
        ...(dto.label !== undefined && { label: dto.label.trim() }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
    });
  }

  async deletePaymentMethod(customerId: string, id: string) {
    const existing = await this.prisma.savedPaymentMethod.findFirst({
      where: { id, customerId },
    });
    if (!existing) throw new NotFoundException("Payment method not found");
    await this.prisma.savedPaymentMethod.delete({ where: { id } });
    return { ok: true };
  }
}
