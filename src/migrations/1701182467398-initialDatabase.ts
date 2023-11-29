import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialDatabase1701182467398 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            generationStrategy: 'uuid',
            type: 'varchar',
            isUnique: true,
            isPrimary: true,
          },
          {
            name: 'username',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'text',
          },
          {
            name: 'displayName',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'dob',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: ['MALE', 'FEMALE'],
            isNullable: false,
          },
          {
            name: 'isEmailVerified',
            type: 'boolean',
            default: false,
          },
          {
            name: 'lastLoginAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
