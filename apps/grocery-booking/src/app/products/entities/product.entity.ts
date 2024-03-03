import {
  Entity,
  EntityRepositoryType,
  Opt,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ProductRepository } from '../product.repository';

@Entity({
  tableName: 'products',
  repository: () => ProductRepository,
})
export class Product {
  [EntityRepositoryType]?: ProductRepository;

  @PrimaryKey({
    type: 'string',
    columnType: 'uuid',
    defaultRaw: `gen_random_uuid()`,
  })
  id!: string & Opt;

  @Property()
  name: string;

  @Property({ type: 'number', fieldName: 'stock_qty' })
  stockQty: number & Opt = 1;

  @Property({ type: 'number' })
  price: number;

  @Property({ type: 'Date', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ nullable: true })
  updatedAt?: Date;

  @Property({ nullable: true })
  deletedAt?: Date;
}
