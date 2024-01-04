import { Injectable } from '@nestjs/common';
import { User} from "../../entities/users";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";


@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
  
  async findOne(name: string): Promise<User> {
    return await this.userRepository.findOneBy({ name });
  }
  
  async createOne({ name, password }: User): Promise<User> {
    return await this.userRepository.save({name, password,});
  }
}

