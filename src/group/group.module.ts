import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { Project } from '@/project/entities/project.entity';
import { User } from '@/users/entities/user.entity';
import { GroupSubscriber } from './group.subscriber';
import { Defense } from '@/defense/entities/defense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Project, User, Defense])],
  controllers: [GroupController],
  providers: [GroupService, GroupSubscriber],
  exports: [GroupService],
})
export class GroupModule {}