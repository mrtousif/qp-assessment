import {
  Entity,
  EntityRepositoryType,
  Enum,
  Opt,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserRepository } from '../user.repository';
import { Role } from '../../common';

@Entity({
  tableName: 'users',
  repository: () => UserRepository,
})
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey({
    type: 'string',
    columnType: 'uuid',
    defaultRaw: `gen_random_uuid()`,
  })
  id!: string & Opt;

  @Property()
  name!: string;

  @Enum({ items: () => Role })
  role: Role & Opt = Role.User;

  @Property({ type: 'Date', length: 6, defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ length: 6, nullable: true })
  updatedAt?: Date;
}
