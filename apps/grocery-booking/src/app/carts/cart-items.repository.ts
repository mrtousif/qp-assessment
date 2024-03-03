import { EntityRepository } from '@mikro-orm/postgresql';
import { CartItems } from './entities/cart-items.entity';
import { Cart } from './entities/cart.entity';
import { Product } from '../products/entities/product.entity';

export class CartItemsRepository extends EntityRepository<CartItems> {
  //   createOrUpdate({ cart, product, quantity }: Props) {
  //     this.create
  //   }
}

interface Props {
  cart: Cart;
  product: Product;
  quantity: number;
}
