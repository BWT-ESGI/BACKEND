import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { Project } from '@/project/entities/project.entity';
import { User } from '@/users/entities/user.entity';
import { Defense } from '@/defense/entities/defense.entity';
import {SaveGroupService} from './saveGroup.service';
import { DeadlineNotExpiredGuard } from './guard/DeadlineNotExpiredGuard';
import { ProjectModule } from '@/project/project.module';
import { Section } from '@/report/entities/section.entity';
import { Report } from '@/report/entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Group, 
    Project, 
    User, 
    Defense,
    Report,
    Section
  ]),
  forwardRef(() => ProjectModule),
],
  controllers: [GroupController],
  providers: [GroupService, SaveGroupService, DeadlineNotExpiredGuard],
  exports: [GroupService, SaveGroupService],
})
export class GroupModule {}