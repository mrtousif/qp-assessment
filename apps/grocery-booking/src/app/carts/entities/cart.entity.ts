import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  Enum,
} from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { CartRepository } from '../cart.repository';

@Entity({ tableName: 'carts', repository: () => CartRepository })
export class Cart {
  [EntityRepositoryType]?: CartRepository;

  @PrimaryKey({
    type: 'string',
    columnType: 'uuid',
    defaultRaw: `gen_random_uuid()`,
  })
  id!: string & Opt;

  @ManyToOne({ entity: () => User, updateRule: 'cascade' })
  user!: User;

  @Enum({ items: () => CartsStatus })
  status: CartsStatus & Opt = CartsStatus.CREATED;

  @Property({ type: 'Date', defaultRaw: `now()` })
  createdAt!: Date & Opt;

  @Property({ nullable: true })
  updatedAt?: Date;
}

export enum CartsStatus {
  CREATED = 'created',
  PURCHASED = 'purchased',
  EXPIRED = 'expired',
}
