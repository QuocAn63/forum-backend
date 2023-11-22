import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { RolePermissions } from './rolePermissions.entity';

@Entity()
export class Permission extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  id: string;

  @Column({ type: 'text' })
  description: string;

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

  @OneToMany(
    () => RolePermissions,
    (rolePermissions) => rolePermissions.permission,
  )
  rolePermissions: RolePermissions[];
}
