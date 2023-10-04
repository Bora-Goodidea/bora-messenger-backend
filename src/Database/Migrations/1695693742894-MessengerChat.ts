import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

const tableName = `messenger_chat`;

export class MessengerChat1695693742894 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: tableName,
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'room_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'target_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'chat_code',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'message',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'checked',
                        type: 'enum',
                        enum: ['Y', 'N'],
                        enumName: 'statusEnum',
                        default: '"N"',
                        isNullable: false,
                    },
                    {
                        name: 'checked_at',
                        type: 'timestamp',
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

        await queryRunner.createIndex(
            tableName,
            new TableIndex({
                name: 'IDX_MESSENGER_CHART',
                columnNames: ['room_id', 'user_id', 'target_id', 'chat_code'],
                isUnique: true,
            }),
        );

        await queryRunner.createIndex(
            tableName,
            new TableIndex({
                name: 'IDX_MESSENGER_CHART_MESSAGE',
                columnNames: ['message'],
                isUnique: false,
            }),
        );

        await queryRunner.createForeignKey(
            tableName,
            new TableForeignKey({
                columnNames: ['room_id'],
                referencedTableName: 'messenger_master',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            tableName,
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            tableName,
            new TableForeignKey({
                columnNames: ['target_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(tableName);
        if (table) {
            await queryRunner.dropTable(tableName);
        }
    }
}
