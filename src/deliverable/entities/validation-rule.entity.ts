import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { Deliverable } from './deliverable.entity';
  
  export type RuleType = 'filePresence' | 'folderStructure' | 'fileContent' | 'maxSize';
  
  @Entity()
  export class ValidationRule {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    type: RuleType;
  
    @Column('text')
    criteria: string; // JSON structure selon le type de règle
  
    @Column('text', { nullable: true })
    description?: string;
  
    @ManyToOne(() => Deliverable, deliverable => deliverable.validationRules)
    deliverable: Deliverable;
  }