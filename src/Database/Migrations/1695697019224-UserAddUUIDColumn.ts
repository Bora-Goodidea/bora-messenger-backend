import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';
import { generateUUID } from '@Helper';

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

        /** 기존 사용자 uid 등록 **/
        const users = await queryRunner.query(`select * from users`);
        for await (const user of users) {
            await queryRunner.query(`update users set uid = '${generateUUID()}' where id = ${user.id}`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users DROP COLUMN uid`);
    }
}
