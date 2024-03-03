import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Product } from './entities/product.entity';
import { UsersModule } from '../users/users.module';
import { Cart } from '../carts/entities/cart.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Product, Cart] }),
    UsersModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
