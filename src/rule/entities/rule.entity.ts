import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Deliverable } from '../../deliverable/entities/deliverable.entity';

export enum RuleType {
  MAX_SIZE = 'MAX_SIZE',
  FILE_EXISTS = 'FILE_EXISTS',
  DIR_STRUCTURE = 'DIR_STRUCTURE',
  CONTENT_REGEX = 'CONTENT_REGEX',
}

@Entity()
export class Rule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Deliverable, (d) => d.submissions, { onDelete: 'CASCADE' })
  deliverable: Deliverable;

  @Column()
  deliverableId: string;

  @Column({ type: 'enum', enum: RuleType })
  type: RuleType;

  @Column('json')
  config: Record<string, any>;

  @Column({ nullable: true })
  preset?: string; // nom du preset utilisé (ex: 'Node.js (Express)' ou 'README.md'), ou null si custom
}