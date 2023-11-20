import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ length: 100, type: 'varchar' })
  password: string;

  @Column({ length: 20, type: 'varchar', nullable: true })
  displayName: string;

  @Column({ type: 'date', nullable: true })
  dob: string;

  @Column({ type: 'enum', enum: ['MALE', 'FEMALE'], nullable: true })
  gender: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: `now()`,
    nullable: true,
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: `now()`,
    nullable: true,
  })
  updatedAt: string;

  @ManyToOne(() => Role)
  role: Role;
}
