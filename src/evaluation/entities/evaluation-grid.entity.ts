import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EvaluationGrid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @Column()
  criteriaSetId: string;

  @Column()
  filledBy: string; // enseignant

  @Column('simple-json')
  scores: Record<string, number>;

  @Column('simple-json')
  comments: Record<string, string>;

  @Column()
  groupId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
