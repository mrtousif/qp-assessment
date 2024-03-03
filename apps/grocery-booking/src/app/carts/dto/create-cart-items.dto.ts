import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCartItemsDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;
}
