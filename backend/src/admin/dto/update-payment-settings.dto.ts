import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";

export class UpdatePaymentSettingsDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value : value == null ? undefined : String(value)))
  @IsString()
  @MaxLength(8000)
  nowpaymentsApiKey?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value : value == null ? undefined : String(value)))
  @IsString()
  @MaxLength(500)
  nowpaymentsPublicKey?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true" || value === true) return true;
    if (value === "false" || value === false) return false;
    return value;
  })
  @IsBoolean()
  nowpaymentsSandbox?: boolean;

  @IsOptional()
  @Transform(({ value }) => (value == null ? undefined : String(value).trim()))
  @ValidateIf((_, v) => typeof v === "string" && v.length > 0)
  @IsEmail()
  @MaxLength(320)
  zelleEmail?: string;

  @IsOptional()
  @Transform(({ value }) => (value == null ? undefined : String(value).trim()))
  @IsString()
  @MaxLength(40)
  zellePhone?: string;
}
