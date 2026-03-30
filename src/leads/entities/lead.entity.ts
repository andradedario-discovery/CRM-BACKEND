import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LeadStatus } from '../enums/lead-status.enum';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  firstName: string;

  @Column({ length: 120 })
  lastName: string;

  @Column({ length: 160, unique: true })
  email: string;

  @Column({ length: 30, nullable: true })
  phone: string;

  @Column({ length: 160, nullable: true })
  company: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
@Column({ length: 120, nullable: true })
source: string;

@Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
amount: number;

@Column({ length: 50, nullable: true })
stage: string;

@Column({ type: 'date', nullable: true })
lastContactDate: Date;
  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @ManyToOne(() => User, { nullable: true, eager: true })
  assignedTo: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
