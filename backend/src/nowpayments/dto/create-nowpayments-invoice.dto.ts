import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateNowpaymentsInvoiceDto {
  @IsString()
  @MinLength(10)
  @MaxLength(40)
  orderId!: string;

  @IsEmail()
  email!: string;
}
