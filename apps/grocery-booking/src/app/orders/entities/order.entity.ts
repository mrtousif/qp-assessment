import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToOne,
  Opt,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Cart } from '../../carts/entities/cart.entity';
import { User } from '../../users/entities/user.entity';
import { OrderRepository } from '../order.repository';

@Entity({ tableName: 'orders', repository: () => OrderRepository })
export class Order {
  [EntityRepositoryType]?: OrderRepository;

  @PrimaryKey({
    type: 'string',
    columnType: 'uuid',
    defaultRaw: `gen_random_uuid()`,
  })
  id!: string & Opt;

  @OneToOne({
    entity: () => User,
    updateRule: 'cascade',
    unique: 'unique_user_cart',
  })
  user!: User;

  @ManyToOne({ entity: () => Cart, updateRule: 'cascade' })
  cart!: Cart;

  @Property({ columnType: 'uuid' })
  transactionId!: string;

  @Property()
  price!: number;

  @Property({ type: 'Date', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ nullable: true })
  updatedAt?: Date;
}
