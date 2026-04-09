import { IsIn, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

export class AffiliatePayoutResolveDto {
  @IsIn(["paid", "rejected"])
  status!: "paid" | "rejected";

  /** Internal note (admin only, not shown to affiliate). */
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNote?: string;

  /** Required when rejecting; shown to the affiliate on their dashboard. */
  @ValidateIf((o: AffiliatePayoutResolveDto) => o.status === "rejected")
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  rejectionReason?: string;
}
