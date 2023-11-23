import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 40 })
  slug: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: 'now()',
    nullable: true,
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: 'now()',
    nullable: true,
  })
  updatedAt: string;

  @Column({ type: 'text' })
  permissions: string;
}
