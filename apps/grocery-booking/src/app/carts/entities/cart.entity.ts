import { Entity, ManyToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Product } from '../../products/entities/product.entity';

@Entity({ tableName: 'carts' })
export class Cart {
  @PrimaryKey({
    type: 'string',
    columnType: 'uuid',
    defaultRaw: `gen_random_uuid()`,
  })
  id!: string & Opt;

  @ManyToOne({ entity: () => Product, updateRule: 'cascade' })
  product!: Product;

  @Property({ type: 'Date', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ nullable: true })
  updatedAt?: Date;
}
