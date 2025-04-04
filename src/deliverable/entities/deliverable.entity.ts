import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Deliverable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @Column({ default: false })
  allowLateSubmission: boolean;

  @Column({ type: 'float', default: 0 })
  penaltyPerHourLate: number;

}
