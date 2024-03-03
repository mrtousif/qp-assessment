import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemsDto } from './create-cart-items.dto';
import { Min } from 'class-validator';

export class UpdateCartItemsDto extends PartialType(CreateCartItemsDto) {
  @Min(1)
  quantity: number;
}
