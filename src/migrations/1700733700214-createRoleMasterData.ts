import { roleConstants } from '../../src/modules/role/role.constant';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleMasterData1700733700214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Inserting Role master data.');

    roleConstants.forEach(async (role) => {
      const insertValues = role.permissions.join(',');
      await queryRunner.manager.query(
        `INSERT INTO "role"("id","name","slug","permissions") VALUES ($1,$2,$1,$3)`,
        [role.id, role.name, insertValues],
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Deleting Role master data.');
    roleConstants.forEach(async (role) => {
      await queryRunner.manager.query(`DELETE FROM "role" WHERE id = $1`, [
        role.id,
      ]);
    });
  }
}
