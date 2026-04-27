import { BadRequestException, Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomBytes } from "crypto";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";
import type { Request } from "express";
import { AdminJwtGuard } from "../auth/guards/admin-jwt.guard";
import { CustomerJwtGuard } from "../auth/guards/customer-jwt.guard";
import { OptionalCustomerJwtGuard } from "../auth/guards/optional-customer-jwt.guard";
import type { AccessTokenPayload } from "../auth/jwt-payload.interface";
import { PreviewCouponDto } from "../coupons/dto/preview-coupon.dto";
import { CouponsService } from "../coupons/coupons.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { SubmitZelleProofDto } from "./dto/submit-zelle-proof.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly orders: OrdersService,
    private readonly coupons: CouponsService
  ) {}

  /** Public: validate coupon against current cart lines (server-priced). */
  @Post("coupon-preview")
  couponPreview(@Body() dto: PreviewCouponDto) {
    return this.coupons.preview(dto);
  }

  /** Public: multipart image for Zelle proof (storefront proxies here in production). */
  @Post("zelle/upload")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 },
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(process.cwd(), "uploads", "zelle");
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const ext =
            file.mimetype === "image/jpeg" ? "jpg" : file.mimetype === "image/png" ? "png" : "webp";
          cb(null, `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`);
        },
      }),
    })
  )
  uploadZelleProofFile(@UploadedFile() file?: Express.Multer.File) {
    if (!file?.filename || !file.path) {
      throw new BadRequestException("Missing file.");
    }
    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowed.has(file.mimetype)) {
      try {
        unlinkSync(file.path);
      } catch {
        /* ignore */
      }
      throw new BadRequestException("Use a JPG, PNG, or WebP image.");
    }
    return { url: `/uploads/zelle/${file.filename}` };
  }

  @Post("zelle/submit-proof")
  submitZelleProof(@Body() dto: SubmitZelleProofDto) {
    return this.orders.submitZelleProof(dto);
  }

  @Post()
  @UseGuards(OptionalCustomerJwtGuard)
  create(
    @Body() dto: CreateOrderDto,
    @Req() req: Request & { user?: AccessTokenPayload }
  ) {
    const customerId = req.user?.role === "CUSTOMER" ? req.user.sub : undefined;
    return this.orders.create(dto, customerId);
  }

  @Get()
  @UseGuards(AdminJwtGuard)
  findAll() {
    return this.orders.findAll();
  }

  @Get("my")
  @UseGuards(CustomerJwtGuard)
  myOrders(@Req() req: Request & { user: AccessTokenPayload }) {
    return this.orders.findMyOrders(req.user.sub, req.user.email);
  }

  @Get("my/:id")
  @UseGuards(CustomerJwtGuard)
  myOrderOne(@Req() req: Request & { user: AccessTokenPayload }, @Param("id") id: string) {
    return this.orders.findOneForCustomer(id, req.user.sub, req.user.email);
  }
}
