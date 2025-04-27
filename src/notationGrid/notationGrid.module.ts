import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/notationGrid.entity';
import { PromotionService } from './notationGrid.service';
import { PromotionController } from './notationGrid.controller';
import { User } from '@/users/entities/user.entity';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion, User]),
    UsersModule,
  ],  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}