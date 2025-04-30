import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { Project } from '@/project/entities/project.entity';
import { User } from '@/users/entities/user.entity';
import { Defense } from '@/defense/entities/defense.entity';
import {SaveGroupService} from './saveGroup.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Project, User, Defense])],
  controllers: [GroupController],
  providers: [GroupService, SaveGroupService],
  exports: [GroupService, SaveGroupService],
})
export class GroupModule {}