import { EntityRepository } from '@mikro-orm/postgresql';
import { Order } from './entities/order.entity';

export class OrderRepository extends EntityRepository<Order> {}
