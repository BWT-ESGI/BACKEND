import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Group } from '@/group/entities/group.entity';

@Module({
  controllers: [ReportController],
  imports: [TypeOrmModule.forFeature([Report, Group])],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}