import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class UserActiveAddSIDColumn1697592147487 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE user_active ADD sid varchar(50) AFTER user_id`);

        await queryRunner.createIndex(
            'user_active',
            new TableIndex({
                name: 'IDX_USER_ACTIVE_SID',
                columnNames: ['sid'],
                isUnique: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE user_active DROP COLUMN sid`);

        const actives = await queryRunner.query(`select * from user_active`);
        for await (const active of actives) {
            await queryRunner.query(`update user_active set active = 'N', updated_at = now() where id = ${active.id}`);
        }
    }
}
