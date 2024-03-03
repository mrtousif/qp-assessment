import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Product } from '../../products/entities/product.entity';
import { CartItemsRepository } from '../cart-items.repository';
import { Cart } from './cart.entity';

@Entity({ tableName: 'carts_items', repository: () => CartItemsRepository })
export class CartItems {
  [EntityRepositoryType]?: CartItemsRepository;

  @PrimaryKey({
    type: 'string',
    columnType: 'uuid',
    defaultRaw: `gen_random_uuid()`,
  })
  id!: string & Opt;

  @ManyToOne({ entity: () => Cart, updateRule: 'cascade' })
  cart!: Cart;

  @ManyToOne({ entity: () => Product, updateRule: 'cascade' })
  product!: Product;

  @Property({ type: 'number' })
  quantity: number & Opt = 1;

  @Property({ type: 'Date', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ length: 6, nullable: true })
  updatedAt?: Date;
}
