import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { CustomerJwtGuard } from "../auth/guards/customer-jwt.guard";
import type { AccessTokenPayload } from "../auth/jwt-payload.interface";
import { AffiliateService } from "../affiliate/affiliate.service";
import { CustomerPortalService } from "./customer-portal.service";
import { CreateAddressDto, UpdateAddressDto } from "./dto/address.dto";
import { AffiliatePayoutRequestDto } from "./dto/affiliate-payout-request.dto";
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from "./dto/payment-method.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { WishlistAddDto } from "./dto/wishlist-add.dto";

@Controller("customer")
@UseGuards(CustomerJwtGuard)
export class CustomerPortalController {
  constructor(
    private readonly portal: CustomerPortalService,
    private readonly affiliate: AffiliateService,
  ) {}

  private cid(req: Request & { user: AccessTokenPayload }) {
    return req.user.sub;
  }

  @Patch("profile")
  updateProfile(
    @Req() req: Request & { user: AccessTokenPayload },
    @Body() dto: UpdateProfileDto
  ) {
    return this.portal.updateProfile(this.cid(req), dto);
  }

  @Get("addresses")
  addresses(@Req() req: Request & { user: AccessTokenPayload }) {
    return this.portal.listAddresses(this.cid(req));
  }

  @Post("addresses")
  createAddress(
    @Req() req: Request & { user: AccessTokenPayload },
    @Body() dto: CreateAddressDto
  ) {
    return this.portal.createAddress(this.cid(req), dto);
  }

  @Patch("addresses/:id")
  updateAddress(
    @Req() req: Request & { user: AccessTokenPayload },
    @Param("id") id: string,
    @Body() dto: UpdateAddressDto
  ) {
    return this.portal.updateAddress(this.cid(req), id, dto);
  }

  @Delete("addresses/:id")
  deleteAddress(@Req() req: Request & { user: AccessTokenPayload }, @Param("id") id: string) {
    return this.portal.deleteAddress(this.cid(req), id);
  }

  @Get("wishlist")
  wishlist(@Req() req: Request & { user: AccessTokenPayload }) {
    return this.portal.listWishlist(this.cid(req));
  }

  @Post("wishlist")
  addWishlist(
    @Req() req: Request & { user: AccessTokenPayload },
    @Body() dto: WishlistAddDto
  ) {
    return this.portal.addWishlist(this.cid(req), dto.productId);
  }

  @Delete("wishlist/:productId")
  removeWishlist(
    @Req() req: Request & { user: AccessTokenPayload },
    @Param("productId") productId: string
  ) {
    return this.portal.removeWishlist(this.cid(req), productId);
  }

  @Get("payment-methods")
  paymentMethods(@Req() req: Request & { user: AccessTokenPayload }) {
    return this.portal.listPaymentMethods(this.cid(req));
  }

  @Post("payment-methods")
  createPaymentMethod(
    @Req() req: Request & { user: AccessTokenPayload },
    @Body() dto: CreatePaymentMethodDto
  ) {
    return this.portal.createPaymentMethod(this.cid(req), dto);
  }

  @Patch("payment-methods/:id")
  updatePaymentMethod(
    @Req() req: Request & { user: AccessTokenPayload },
    @Param("id") id: string,
    @Body() dto: UpdatePaymentMethodDto
  ) {
    return this.portal.updatePaymentMethod(this.cid(req), id, dto);
  }

  @Delete("payment-methods/:id")
  deletePaymentMethod(
    @Req() req: Request & { user: AccessTokenPayload },
    @Param("id") id: string
  ) {
    return this.portal.deletePaymentMethod(this.cid(req), id);
  }

  @Get("affiliate/me")
  affiliateMe(@Req() req: Request & { user: AccessTokenPayload }) {
    return this.affiliate.getAffiliateMe(this.cid(req));
  }

  @Post("affiliate/payout-request")
  affiliatePayoutRequest(
    @Req() req: Request & { user: AccessTokenPayload },
    @Body() dto: AffiliatePayoutRequestDto
  ) {
    return this.affiliate.createPayoutRequest(this.cid(req), dto);
  }
}
