import { IsOptional, IsString, MaxLength } from "class-validator";

export class MarkExternalPaidDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  referenceNote?: string;
}
