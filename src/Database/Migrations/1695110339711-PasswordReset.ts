import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class PasswordReset1695110339711 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'password_reset',
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
                        name: 'reset_code',
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
                        default: '"N"',
                        isNullable: false,
                    },
                    {
                        name: 'completed_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
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
            'password_reset',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );

        await queryRunner.createIndex(
            'password_reset',
            new TableIndex({
                name: 'IDX_PASSWORD_RESET_RESET_CODE',
                columnNames: ['reset_code'],
                isUnique: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('password_reset');
        if (table) {
            await queryRunner.dropTable('password_reset');
        }
    }
}
