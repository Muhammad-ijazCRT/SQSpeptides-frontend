import { IsBoolean, IsInt, IsOptional, IsString, Length, Max, Min, MinLength } from "class-validator";

export class CreatePaymentMethodDto {
  @IsString()
  @MinLength(1)
  label!: string;

  @IsString()
  @MinLength(1)
  brand!: string;

  @IsString()
  @Length(4, 4)
  last4!: string;

  @IsInt()
  @Min(1)
  @Max(12)
  expMonth!: number;

  @IsInt()
  @Min(2024)
  @Max(2100)
  expYear!: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdatePaymentMethodDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  label?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
