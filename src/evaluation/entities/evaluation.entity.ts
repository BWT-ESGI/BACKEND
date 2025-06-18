import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from '@/group/entities/group.entity';

@Entity()
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  criteria: string;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'float', nullable: true })
  score?: number;

  @Column({ nullable: true })
  comment?: string;

  @ManyToOne(() => Group)
  group: Group;
}