import { User } from '../entities/user.entity';
import { Exclude, Expose, Type } from 'class-transformer';
import { Promotion } from '@/promotion/entities/promotion.entity';
import { Group } from '@/group/entities/group.entity';
import { Submission } from '@/submission/entities/submission.entity';

@Exclude()
export class UserPublicDto {
  @Expose() id: string;
  @Expose() email: string;
  @Expose() username?: string;
  @Expose() firstName?: string;
  @Expose() lastName?: string;
  @Expose() role: string;
  @Expose() description?: string;

  @Expose() @Type(() => Promotion) promotions: Promotion[];
  @Expose() @Type(() => Group) groupsLed: Group[];
  @Expose() @Type(() => Submission) submissions: Submission[];
}