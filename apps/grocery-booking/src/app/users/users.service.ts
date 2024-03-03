import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from '@mikro-orm/core';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly em: EntityManager
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findAll() {
    return this.userRepository.findAll({});
  }

  findOne(id: string) {
    return this.userRepository.findOne({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.nativeUpdate({ id }, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.nativeDelete({ id });
  }
}
