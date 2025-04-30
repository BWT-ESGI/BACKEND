import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefenseService } from './defense.service';
import { DefenseController } from './defense.controller';
import { Defense } from './entities/defense.entity';
import { Group } from '@/group/entities/group.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Defense, Group])],
  providers: [DefenseService],
  controllers: [DefenseController],
})
export class DefenseModule {}