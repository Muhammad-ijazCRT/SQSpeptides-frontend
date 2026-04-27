import { IsString } from "class-validator";

export class WishlistAddDto {
  @IsString()
  productId!: string;
}
