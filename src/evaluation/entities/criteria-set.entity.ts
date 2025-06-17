import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Criteria } from './criteria.entity';

@Entity()
export class CriteriaSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  groupId?: string;

  @Column('float')
  weight: number;

  @OneToMany(() => Criteria, (criteria) => criteria.criteriaSet, { cascade: true })
  criteria: Criteria[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  type: 'defense' | 'deliverable' | 'report';
}
