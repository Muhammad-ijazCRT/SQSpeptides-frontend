import { IsEmail, IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePayramPaymentDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  orderId!: string;

  @IsEmail()
  customerEmail!: string;

  @IsOptional()
  @IsIn(["crypto", "onramp"])
  mode?: "crypto" | "onramp";
}
