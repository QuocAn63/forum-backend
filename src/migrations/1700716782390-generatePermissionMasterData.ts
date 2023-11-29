import { permissionConstants } from '../../src/modules/permission/permission.constant';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneratePermissionMasterData1700716782390
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Inserting master data for Permission');
    permissionConstants.forEach(({ key, actions }) => {
      actions.forEach(async ({ suffix, description }) => {
        await queryRunner.manager.query(
          `INSERT INTO "permission"("id", "description") VALUES ($1, $2)`,
          [`${key}_${suffix}`, description],
        );
      });
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Deleting master data at Permission');
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
