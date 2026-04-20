import { Type } from "class-transformer";
import { IsEmail, IsIn, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateIf } from "class-validator";

export class CreatePaymentInvoiceDto {
  @IsIn(["external", "nowpayments", "zelle"])
  gatewayType!: "external" | "nowpayments" | "zelle";

  @IsString()
  @MaxLength(80)
  gatewayLabel!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsEmail()
  customerEmail!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  customerName?: string;

  @ValidateIf((o: CreatePaymentInvoiceDto) => o.gatewayType === "external")
  @IsString()
  @MaxLength(2000)
  externalCheckoutUrl?: string;
}
