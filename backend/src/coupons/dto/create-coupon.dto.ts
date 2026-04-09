import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateCouponDto {
  @IsString()
  @MaxLength(40)
  code!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(100)
  percentOff!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxUses?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean;
}
