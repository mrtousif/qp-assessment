import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCartItemsDto } from './dto/create-cart-items.dto';
import { UpdateCartItemsDto } from './dto/update-cart-items.dto';
import { EntityManager } from '@mikro-orm/core';
import to from 'await-to-js';
import { CartRepository } from './cart.repository';
import { CartItemsRepository } from './cart-items.repository';
import { User } from '../users/entities/user.entity';
import { ProductRepository } from '../products/product.repository';
import { CartsStatus } from './entities/cart.entity';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name);
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly cartItemsRepository: CartItemsRepository,
    private readonly productRepository: ProductRepository,
    private readonly em: EntityManager
  ) {}

  async create(createCartDto: CreateCartItemsDto, user: User) {
    const { productId } = createCartDto;
    let { quantity } = createCartDto;
    const [err, product] = await to(
      this.productRepository.findOneOrFail(productId)
    );
    if (err) {
      throw new NotFoundException(`Product ${productId} not found`);
    } else if (product.stockQty < quantity) {
      throw new UnprocessableEntityException(
        `Product ${productId} is not available`
      );
    }
    const cart = await this.cartRepository.findOrCreate(user);
    let cartItem = await this.cartItemsRepository.findOne({ cart, product });
    if (cartItem) {
      quantity += cartItem.quantity;
      if (product.stockQty < quantity) {
        throw new UnprocessableEntityException(
          `Product ${product.id} out of stock`
        );
      }

      await this.cartItemsRepository.nativeUpdate(
        { id: cartItem.id },
        {
          quantity,
        }
      );
    } else {
      cartItem = await this.cartItemsRepository.create({
        id: cartItem?.id,
        cart,
        product,
        quantity,
      });
    }

    this.em.persist(cartItem);
    await this.em.flush();
    cartItem.quantity = quantity;

    return {
      cartId: cartItem.cart.id,
      productId: cartItem.product.id,
      quantity: cartItem.quantity,
    };
  }

  findAll() {
    return this.cartRepository.findAll({});
  }

  async findOne(user: User) {
    const cart = await this.cartRepository.findOne({
      user,
      status: CartsStatus.CREATED,
    });
    if (!cart) {
      throw new NotFoundException(`Cart not found`);
    }

    return this.cartItemsRepository.findAll({
      where: {
        cart,
      },
      populate: ['product'],
    });
  }
}
