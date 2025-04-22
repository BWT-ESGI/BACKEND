import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from '@/group/entities/group.entity';
import { Month } from '../enums/month.enum';

@Entity()
export class Defense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp' })
  start: Date;

  @Column({ type: 'timestamp' })
  end: Date;

  @Column({ type: 'enum', enum: Month })
  month: Month;

  @ManyToOne(() => Group, (group) => group.defenses, { onDelete: 'CASCADE' })
  @JoinColumn()
  group: Group;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
