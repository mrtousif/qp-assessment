import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  cartId: string;

  transactionId: string;
}
