import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule, MikroOrmMiddleware } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ENVALID, EnvalidModule } from 'nestjs-envalid';
import { Config, validators } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';
import { UsersModule } from './users/users.module';
import { AuthGuard, RolesGuard } from './common';

@Module({
  imports: [
    EnvalidModule.forRoot({ validators, isGlobal: true }),
    MikroOrmModule.forRootAsync({
      inject: [ENVALID],
      useFactory: (env: Config) => {
        return {
          dbName: env.POSTGRES_DB,
          driver: PostgreSqlDriver,
          autoLoadEntities: true,
          debug: env.isDev,
          host: env.POSTGRES_HOST,
          user: env.POSTGRES_USER,
          password: env.POSTGRES_PASSWORD,
          port: env.POSTGRES_PORT,
        };
      },
    }),
    ProductsModule,
    OrdersModule,
    CartsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly orm: MikroORM) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
