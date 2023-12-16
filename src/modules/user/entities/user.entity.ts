import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity()
export class User extends BaseEntity {
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

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ type: 'date', nullable: true })
  dob: string;

  @Column({ type: 'enum', enum: ['MALE', 'FEMALE'], nullable: true })
  gender: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: string;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

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

  @Column({ type: 'varchar', default: 'USER' })
  roleId: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
