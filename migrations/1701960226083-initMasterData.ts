import { MigrationInterface, QueryRunner } from 'typeorm';
import data from '../db/data.json';

export class InitMasterData1701960226083 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { users, roles, permissions } = data;
    const manager = queryRunner.manager;

    const insertPermissionsQuery = `INSERT INTO "permission" ("id", "description") VALUES ${permissions
      .map((permission) => `('${permission.id}', '${permission.desciprtions})'`)
      .join(',')}`;

    const insertRolesQuery = `INSERT INTO "role" ("id", "name", "slug", "permissions") VALUES ${roles
      .map(
        (role) =>
          `('${role.id}', '${role.name}', '${
            role.id
          }', '${role.permissions.join(',')}')`,
      )
      .join(',')}`;

    const insertUsersQuery = `INSERT INTO "user" ("username", "password", "email", "displayName", "roleId") VALUES ${users
      .map(
        (user) =>
          `('${user.username}', '${user.password}', '${user.email}', '${user.displayName}', '${user.role}')`,
      )
      .join(',')}`;

    await manager.query(insertPermissionsQuery);
    await manager.query(insertRolesQuery);
    await manager.query(insertUsersQuery);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { users, roles, permissions } = data;
    const manager = queryRunner.manager;

    const restorePermissionsQuery = `DELETE FROM "permission" WHERE "id" IN (${permissions
      .map((permission) => `'${permission.id}'`)
      .join(',')})`;

    const restoreRolesQuery = `DELETE FROM "role" WHERE "id" IN (${roles
      .map((role) => `'${role.id}'`)
      .join(',')})`;

    const restoreUsersQuery = `DELETE FROM "user" WHERE "username" IN (${users
      .map((user) => `'${user.username}'`)
      .join(',')})`;

    await manager.query(restoreUsersQuery);
    await manager.query(restoreRolesQuery);
    await manager.query(restorePermissionsQuery);
  }
}
