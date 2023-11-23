import { permissionStrings } from '../../src/modules/permission/permission.constant';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneratePermissionMasterData1700716782390
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Inserting master data for Permission');
    Object.keys(permissionStrings).forEach((key) => {
      permissionStrings[key].forEach(async (perm) => {
        await queryRunner.manager.query(
          `INSERT INTO "permission"("id","description") VALUES($1,$2)`,
          [`${key}_${perm}`, perm],
        );
      });
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Deleting master data at Permission');
    Object.keys(permissionStrings).forEach((key) => {
      permissionStrings[key].forEach(async (perm) => {
        await queryRunner.manager.query(
          `DELETE FROM "permission" WHERE "id" = $1`,
          [`${key}_${perm}`],
        );
      });
    });
  }
}
