import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CriteriaSet } from './criteria-set.entity';

@Entity()
export class Criteria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  criteriaSetId: string;

  @ManyToOne(() => CriteriaSet, (criteriaSet) => criteriaSet.criteria, { onDelete: 'CASCADE' })
  criteriaSet: CriteriaSet;

  @Column()
  label: string;

  @Column('int')
  maxScore: number;

  @Column('float')
  weight: number;

  @Column({ nullable: true })
  commentGlobal?: string;

  @Column({ nullable: true })
  commentPerCriteria?: string;
}
