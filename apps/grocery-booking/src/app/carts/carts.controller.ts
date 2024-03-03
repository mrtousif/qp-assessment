import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartItemsDto } from './dto/create-cart-items.dto';
import { UpdateCartItemsDto } from './dto/update-cart-items.dto';
import { LoggedInUser, Roles, Role } from '../common';
import { User } from '../users/entities/user.entity';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(
    @Body() createCartDto: CreateCartItemsDto,
    @LoggedInUser() user: User
  ) {
    return this.cartsService.create(createCartDto, user);
  }

  @Get()
  findAll(@LoggedInUser() user: User) {
    return this.cartsService.findOne(user);
  }
}
