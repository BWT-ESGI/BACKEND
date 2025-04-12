import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { Promotion } from '@/promotion/entities/promotion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Promotion])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}