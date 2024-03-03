import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Cart } from './entities/cart.entity';
import { Product } from '../products/entities/product.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { CartItems } from './entities/cart-items.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Cart, User, CartItems, Product] }),
    UsersModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
