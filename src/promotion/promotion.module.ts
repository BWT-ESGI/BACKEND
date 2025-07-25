import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { User } from '@/users/entities/user.entity';
import { UsersModule } from '@/users/users.module';
import { Group } from '@/group/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion, User, Group]),
    UsersModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}