import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class AffiliatePayoutRequestDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(1_000_000)
  amount!: number;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  cryptoNetwork!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  cryptoAddress!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
