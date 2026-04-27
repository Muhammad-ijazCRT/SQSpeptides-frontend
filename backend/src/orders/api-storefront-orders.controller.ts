import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { OptionalCustomerJwtGuard } from "../auth/guards/optional-customer-jwt.guard";
import type { AccessTokenPayload } from "../auth/jwt-payload.interface";
import { PreviewCouponDto } from "../coupons/dto/preview-coupon.dto";
import { CouponsService } from "../coupons/coupons.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

/**
 * Same handlers as `OrdersController` but under `/api/...` so storefront BFFs
 * (and reverse proxies that only forward `/api/*`) hit a real route — avoids HTTP 404.
 */
@Controller("api")
export class ApiStorefrontOrdersController {
  constructor(
    private readonly orders: OrdersService,
    private readonly coupons: CouponsService
  ) {}

  @Post("orders")
  @UseGuards(OptionalCustomerJwtGuard)
  create(
    @Body() dto: CreateOrderDto,
    @Req() req: Request & { user?: AccessTokenPayload }
  ) {
    const customerId = req.user?.role === "CUSTOMER" ? req.user.sub : undefined;
    return this.orders.create(dto, customerId);
  }

  @Post("orders/coupon-preview")
  couponPreview(@Body() dto: PreviewCouponDto) {
    return this.coupons.preview(dto);
  }
}
