import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { Submission } from '../../submission/entities/submission.entity';
  import { Rule } from '../../rule/entities/rule.entity';
  
  @Entity()
  export class RuleResult {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Submission, (s) => s.id, { onDelete: 'CASCADE' })
    submission: Submission;
  
    @Column()
    submissionId: string;
  
    @ManyToOne(() => Rule, (r) => r.id, { onDelete: 'CASCADE' })
    rule: Rule;
  
    @Column({ nullable: true })
    ruleId: string | null;
  
    @Column({ default: false })
    passed: boolean;
  
    @Column('text')
    message: string;
  
    @CreateDateColumn()
    checkedAt: Date;
  }