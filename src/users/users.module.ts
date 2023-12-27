import { Module } from '@nestjs/common';
import { UsersService } from './services';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/users";

@Module({
  // imports: [ TypeOrmModule.forFeature([User]) ],
  providers: [ UsersService ],
  exports: [ UsersService ],
})
export class UsersModule {}
