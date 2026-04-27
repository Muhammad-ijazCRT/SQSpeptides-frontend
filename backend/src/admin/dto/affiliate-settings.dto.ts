import { Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

export class UpdateAffiliateSettingsDto {
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(100)
  affiliateCommissionPercent!: number;
}
