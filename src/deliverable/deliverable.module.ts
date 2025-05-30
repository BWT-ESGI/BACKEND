import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deliverable } from './entities/deliverable.entity';
import { ValidationRule } from './entities/validation-rule.entity';
import { Project } from '@/project/entities/project.entity';
import { DeliverableService } from './deliverable.service';
import { DeliverableController } from './deliverable.controller';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Deliverable,
      ValidationRule,
      Project,
    ]),
    MinioModule,
  ],
  providers: [DeliverableService],
  controllers: [DeliverableController],
  exports: [DeliverableService],
})
export class DeliverableModule {}