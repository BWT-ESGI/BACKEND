import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NotationGrid } from '@/notationGrid/entities/notationGrid.entity';
import { Project } from '@/project/entities/project.entity';

export type NotationGridScope = 'groupe' | 'individuel';
export type NotationGridType = 'delivrable' | 'defense' | 'report';

@Entity()
export class ProjectNotationGrid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.notationGrids, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @ManyToOne(() => NotationGrid, (grid) => grid.projectAssignments, {
    cascade: true,
    eager: true,
  })
  notationGrid: NotationGrid;

  @Column({
    type: 'enum',
    enum: ['delivrable', 'defense', 'report'],
  })
  type: NotationGridType;

  @Column({
    type: 'enum',
    enum: ['groupe', 'individuel'],
  })
  scope: NotationGridScope;
}
