import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EntityManager } from '@mikro-orm/core';
import { ProductRepository } from './product.repository';
import { User } from '../users/entities/user.entity';
import { Role } from '../common';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly em: EntityManager
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    await this.em.persistAndFlush(product);

    return product;
  }

  findAll(user?: User) {
    let stockQty = 1;
    if (user?.role === Role.Admin) {
      stockQty = 0;
    }

    return this.productRepository.findAll({
      where: {
        stockQty: {
          $gte: stockQty,
        },
        deletedAt: {
          $eq: null,
        },
      },
    });
  }

  findOne(id: string) {
    return this.productRepository.findOne({
      id,
      deletedAt: {
        $eq: null,
      },
    });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.nativeUpdate({ id }, updateProductDto);
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return this.productRepository.nativeUpdate(
      { id },
      {
        deletedAt: new Date().toISOString(),
      }
    );
  }
}
