import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Deliverable } from '@/deliverable/entities/deliverable.entity';
import { Group } from '@/group/entities/group.entity';
import { User } from '@/users/entities/user.entity';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submittedAt: Date;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ nullable: true })
  gitRepoUrl?: string;

  @Column({ default: false })
  isLate: boolean;

  @ManyToOne(() => Deliverable)
  deliverable: Deliverable;

  @ManyToOne(() => Group, { nullable: true })
  group?: Group;

  @ManyToOne(() => User, { nullable: true })
  student?: User;
}