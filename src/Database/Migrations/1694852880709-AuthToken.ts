import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class AuthToken1694852880709 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'auth_token',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['Y', 'N'],
                        enumName: 'statusEnum',
                        default: '"Y"',
                        isNullable: false,
                    },
                    {
                        name: 'verified_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'auth_token',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );

        await queryRunner.createIndex(
            'auth_token',
            new TableIndex({
                name: 'IDX_AUTH_TOKEN_USER_ID',
                columnNames: ['user_id'],
                isUnique: true,
            }),
        );

        await queryRunner.createIndex(
            'auth_token',
            new TableIndex({
                name: 'IDX_AUTH_TOKEN_TOKEN',
                columnNames: ['token'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('auth_token');
        if (table) {
            await queryRunner.dropTable('auth_token');
        }
    }
}
