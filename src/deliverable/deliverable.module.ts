import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deliverable } from './entities/deliverable.entity';
import { DeliverableService } from './deliverable.service';
import { DeliverableController } from './deliverable.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Deliverable])],
  providers: [DeliverableService],
  controllers: [DeliverableController],
  exports: [DeliverableService],
})
export class DeliverableModule {}