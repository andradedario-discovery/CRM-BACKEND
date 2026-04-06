import { Column, Entity, PrimaryColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('cobranzas_snapshots')
export class CobranzasSnapshot {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column({ type: 'jsonb', nullable: true })
  rows!: Record<string, any>[];

  @Column({ type: 'int', default: 0 })
  totalRows!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}