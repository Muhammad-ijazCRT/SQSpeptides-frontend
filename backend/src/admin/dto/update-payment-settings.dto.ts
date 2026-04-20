import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateIf } from "class-validator";

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

  @IsOptional()
  @IsString()
  @MaxLength(255)
  mailHost?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "" || value == null) return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  })
  @ValidateIf((_, v) => v != null)
  @IsInt()
  @Min(1)
  @Max(65535)
  mailPort?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true" || value === true) return true;
    if (value === "false" || value === false) return false;
    return value;
  })
  @IsBoolean()
  mailSecure?: boolean;

  @IsOptional()
  @Transform(({ value }) => (value == null ? undefined : String(value).trim()))
  @IsString()
  @MaxLength(320)
  mailUser?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value : value == null ? undefined : String(value)))
  @IsString()
  @MaxLength(8000)
  mailPassword?: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  mailFrom?: string;
}
