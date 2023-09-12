import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

export class Users1684475213993 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'type',
                        type: 'char',
                        length: '6',
                        isNullable: true,
                    },
                    {
                        name: 'level',
                        type: 'char',
                        length: '6',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'char',
                        length: '6',
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'nickname',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'email_verified_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'updated_at',
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
        )

        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                columnNames: ['type'],
                referencedTableName: 'codes',
                referencedColumnNames: ['code_id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        )

        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                columnNames: ['level'],
                referencedTableName: 'codes',
                referencedColumnNames: ['code_id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        )

        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                columnNames: ['status'],
                referencedTableName: 'codes',
                referencedColumnNames: ['code_id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        )

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_EMAIL',
                columnNames: ['email'],
                isUnique: true,
            }),
        )

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_NICKNAME',
                columnNames: ['nickname'],
                isUnique: true,
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('users')
        if (table) {
            await queryRunner.dropTable('users')
        }
    }
}
