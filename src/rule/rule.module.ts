import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rule])],
  providers: [RuleService],
  controllers: [RuleController],
  exports: [RuleService],
})
export class RuleModule {}