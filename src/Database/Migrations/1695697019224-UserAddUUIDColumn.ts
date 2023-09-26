import { MigrationInterface, QueryRunner, TableForeignKey, TableIndex } from 'typeorm';

export class UserAddUUIDColumn1695697019224 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users ADD uid varchar(40) AFTER id`);

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_UID',
                columnNames: ['uid'],
                isUnique: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users DROP COLUMN uid`);
    }
}
