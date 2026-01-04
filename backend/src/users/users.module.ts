import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../database/entities/user.entity';
import { StyleProfile } from '../database/entities/style-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, StyleProfile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
