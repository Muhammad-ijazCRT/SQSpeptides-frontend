import { Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

export class OrderLineDto {
  @IsString()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsEmail()
  email!: string;

  @IsString()
  fullName!: string;

  @IsString()
  addressLine1!: string;

  @IsString()
  city!: string;

  @IsString()
  postalCode!: string;

  @IsString()
  country!: string;

  @IsString()
  @IsIn([
    "Independent",
    "Educational",
    "University",
    "Laboratory",
    "SUBQ_SCIENTIST_PURCHASER_AGREEMENT_V1",
    "PETRA_PEPTIDE_PURCHASER_AGREEMENT_V1",
  ])
  researchUseAttestation!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  items!: OrderLineDto[];

  /** Affiliate link code from `?ref=` (stored client-side). */
  @IsOptional()
  @Transform(({ value }) => (value === "" || value == null ? undefined : value))
  @IsString()
  @MaxLength(80)
  affiliateRef?: string;

  /** USD from logged-in customer's affiliate balance (max order subtotal). */
  @IsOptional()
  @Transform(({ value }) => (value === "" || value == null ? undefined : Number(value)))
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  storeCreditToUse?: number;

  @IsOptional()
  @Transform(({ value }) => (value === "" || value == null ? undefined : value))
  @IsString()
  @MaxLength(80)
  couponCode?: string;
}
