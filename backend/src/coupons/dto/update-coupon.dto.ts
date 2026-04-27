import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, Max, Min } from "class-validator";

export class UpdateCouponDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(100)
  percentOff?: number;

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
