import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersHelperService } from './users-helper.service';
import { Group } from '@/group/entities/group.entity';
import { Project } from '@/project/entities/project.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersHelperService],
  imports: [TypeOrmModule.forFeature([User, Group, Project])],
  exports: [TypeOrmModule, UsersService, UsersHelperService],
})
export class UsersModule {}
