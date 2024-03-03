import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Cart } from '../carts/entities/cart.entity';
import { UsersModule } from '../users/users.module';
import { CartItems } from '../carts/entities/cart-items.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Order, User, Cart, CartItems] }),
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
