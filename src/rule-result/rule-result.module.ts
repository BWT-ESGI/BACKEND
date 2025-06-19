import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuleResult } from './entities/rule-result.entity';
import { RuleResultService } from './rule-result.service';
import { RuleResultController } from './rule-result.controller';


@Module({
  imports: [TypeOrmModule.forFeature([RuleResult])],
  providers: [RuleResultService],
  controllers: [RuleResultController],
  exports: [RuleResultService],
})
export class RuleResultModule { }