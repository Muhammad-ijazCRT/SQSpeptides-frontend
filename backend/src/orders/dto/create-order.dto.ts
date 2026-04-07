import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsString,
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
    "PETRA_PEPTIDE_PURCHASER_AGREEMENT_V1",
  ])
  researchUseAttestation!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  items!: OrderLineDto[];
}
