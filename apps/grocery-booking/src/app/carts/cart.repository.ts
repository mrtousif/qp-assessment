import { EntityRepository } from '@mikro-orm/postgresql';
import { Cart, CartsStatus } from './entities/cart.entity';
import { User } from '../users/entities/user.entity';

export class CartRepository extends EntityRepository<Cart> {
  async findOrCreate(user: User) {
    const existingCart = await this.findOne({
      user,
      status: {
        $eq: CartsStatus.CREATED,
      },
    });

    if (!existingCart) {
      const cart = this.create({ user });
      this.em.persist(cart);
      return cart;
    }

    return existingCart;
  }
}
