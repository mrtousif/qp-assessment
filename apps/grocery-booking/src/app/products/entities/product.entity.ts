import { Entity, Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'products' })
export class Product {
  @PrimaryKey({
    type: 'string',
    columnType: 'uuid',
    defaultRaw: `gen_random_uuid()`,
  })
  id!: string & Opt;

  @Property()
  name!: string;

  @Property({ type: 'number', nullable: true })
  stockQty?: number & Opt = 1;

  @Property({ type: 'Date', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ nullable: true })
  updatedAt?: Date;
}
