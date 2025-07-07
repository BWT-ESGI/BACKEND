import {
  Column,
  CreateDateColumn,
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

  @Column({ nullable: true })
  archiveObjectName: string; // clé MinIO

  @Column({ default: false })
  isLate: boolean;

  @Column({ type: 'float', default: 0 })
  penaltyApplied: number;

  @Column()
  deliverableId: string;

  @ManyToOne(() => Deliverable)
  deliverable: Deliverable;

  @Column()
  groupId: string;

  @ManyToOne(() => Group, { nullable: true, onDelete: 'CASCADE' })
  group?: Group;

  @ManyToOne(() => User, { nullable: true })
  student?: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  filename?: string;

  @Column({ nullable: true, type: 'bigint' })
  size?: number;
}