import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder, Factory } from '@mikro-orm/seeder';
import { User } from '../app/users/entities/user.entity';
import { Product } from '../app/products/entities/product.entity';
import { Role } from '../app/common';
import { faker } from '@faker-js/faker/locale/en';

function getRandomValueFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);

  return array[randomIndex];
}

export class UserFactory extends Factory<User> {
  model = User;

  definition(): Partial<User> {
    return {
      name: faker.person.fullName(),
      role: getRandomValueFromArray([Role.Admin, Role.User]),
    };
  }
}

export class ProductFactory extends Factory<Product> {
  model = Product;

  definition(): Partial<Product> {
    return {
      name: faker.commerce.productName(),
      stockQty: 5,
      price: Number(faker.commerce.price({ max: 200 })),
    };
  }
}

export class UserSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    // save the entity to the context
    context.users = new UserFactory(em).make(5);
  }
}

export class ProductSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    context.products = new ProductFactory(em).make(5);
  }
}

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [UserSeeder, ProductSeeder]);
  }
}
