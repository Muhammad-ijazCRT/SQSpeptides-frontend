import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsString, MaxLength, ValidateNested } from "class-validator";
import { OrderLineDto } from "../../orders/dto/create-order.dto";

export class PreviewCouponDto {
  @IsString()
  @MaxLength(80)
  code!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  items!: OrderLineDto[];
}
