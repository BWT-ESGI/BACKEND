import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuleResult } from './entities/rule-result.entity';
import { RuleResultService } from './rule-result.service';


@Module({
  imports: [TypeOrmModule.forFeature([RuleResult])],
  providers: [RuleResultService],
  exports: [RuleResultService],
})
export class RuleResultModule {}