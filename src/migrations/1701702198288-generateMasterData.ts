import { permissionConstants } from '../modules/permission/permission.constant';
import { roleConstants } from '../modules/role/role.constant';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateMasterData1701702198288 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Inserting master data for Permission table.');
    permissionConstants.forEach(({ key, actions }) => {
      actions.forEach(async ({ suffix, description }) => {
        await queryRunner.manager.query(
          `INSERT INTO "permission"("id", "description") VALUES ($1, $2)`,
          [`${key}_${suffix}`, description],
        );
      });
    });

    console.log('Inserting master data for Role table.');
    roleConstants.forEach(async (role) => {
      const insertValues = role.permissions.join(',');
      await queryRunner.manager.query(
        `INSERT INTO "role"("id","name","slug","permissions") VALUES ($1,$2,$1,$3)`,
        [role.id, role.name, insertValues],
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Deleting master data at Role table.');
    roleConstants.forEach(async (role) => {
      await queryRunner.manager.query(`DELETE FROM "role" WHERE id = $1`, [
        role.id,
      ]);
    });

    console.log('Deleting master data at Permission table.');
    permissionConstants.forEach(({ key, actions }) => {
      actions.forEach(async ({ suffix }) => {
        await queryRunner.manager.query(
          `DELETE FROM "permission" WHERE "id" = $1`,
          [`${key}_${suffix}`],
        );
      });
    });
  }
}
