import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { EntityManager, NotFoundError } from '@mikro-orm/core';
import { OrderRepository } from './order.repository';
import { User } from '../users/entities/user.entity';
import { CartRepository } from '../carts/cart.repository';
import { randomUUID } from 'crypto';
import { CartItemsRepository } from '../carts/cart-items.repository';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly cartItemsRepository: CartItemsRepository,
    private readonly em: EntityManager
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const { transactionId = randomUUID(), cartId } = createOrderDto;
    const cart = await this.cartRepository.findOne({ user, id: cartId });
    if (!cart) {
      throw new NotFoundError(`Cart ${cartId} not found`);
    }
    let order = await this.orderRepository.findOne({
      cart,
      user,
    });

    if (!order) {
      const cartItems = await this.cartItemsRepository.findAll({
        where: {
          cart,
        },
        populate: ['product'],
      });

      let orderPrice = 0;
      for (const item of cartItems) {
        orderPrice += item.product.price * item.quantity;
      }

      order = this.orderRepository.create({
        cart,
        user,
        transactionId,
        price: orderPrice,
      });
      await this.em.persistAndFlush(order);
    }

    return { id: order.id, price: order.price, createdAt: order.createdAt };
  }

  findAll(user: User) {
    return this.orderRepository.findAll({
      where: {
        user,
      },
    });
  }

  findOne(id: string) {
    return this.orderRepository.findOne({ id });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    const { transactionId } = updateOrderDto;
    return this.orderRepository.nativeUpdate({ id }, { transactionId });
  }

  remove(id: string) {
    return this.orderRepository.nativeDelete({ id });
  }
}
