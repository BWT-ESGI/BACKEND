import { NotationGrid } from '@/notationGrid/entities/notationGrid.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Criterion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('float')
  maxNote: number;

  @Column('decimal', { precision: 3, scale: 2 })
  weight: number;

  @ManyToOne(() => NotationGrid, (grid) => grid.criteria, {
    onDelete: 'CASCADE',
  })
  grid: NotationGrid;
}
