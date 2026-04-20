import { IsEmail, IsString } from "class-validator";

export class NowpaymentsSyncDto {
  @IsEmail()
  email!: string;
}
