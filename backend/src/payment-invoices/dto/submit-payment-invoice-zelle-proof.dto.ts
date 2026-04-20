import { Transform } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class SubmitPaymentInvoiceZelleProofDto {
  @IsEmail()
  email!: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(240)
  transactionId!: string;

  /** Relative URL from upload proxy, e.g. /uploads/zelle/…. */
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(8)
  @MaxLength(500)
  proofUrl!: string;
}
