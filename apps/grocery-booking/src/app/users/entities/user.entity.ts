import { Entity, Opt, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({
  tableName: 'users',
})
export class User {
  @PrimaryKey({
    type: 'string',
    columnType: 'uuid',
    defaultRaw: `gen_random_uuid()`,
  })
  id!: string & Opt;

  @Property()
  name!: string;

  @Property()
  role!: string;

  @Property({ type: 'Date', length: 6, defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ length: 6, nullable: true })
  updatedAt?: Date;
}
