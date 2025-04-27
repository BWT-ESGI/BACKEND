import { Criterion } from '@/criterion/entities/criterion.entity';
import { ProjectNotationGrid } from '@/projectNotationGrid/entities/projectNotationGrid.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class NotationGrid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Criterion, (criterion) => criterion.grid, { cascade: true })
  criteria: Criterion[];

  @OneToMany(() => ProjectNotationGrid, (png) => png.notationGrid)
  projectAssignments: ProjectNotationGrid[];
}
