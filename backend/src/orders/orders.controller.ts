import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AdminJwtGuard } from "../auth/guards/admin-jwt.guard";
import { CustomerJwtGuard } from "../auth/guards/customer-jwt.guard";
import { OptionalCustomerJwtGuard } from "../auth/guards/optional-customer-jwt.guard";
import type { AccessTokenPayload } from "../auth/jwt-payload.interface";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

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
