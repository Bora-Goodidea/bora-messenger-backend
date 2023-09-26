import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

const tableName = `messenger_target`;

export class MessengerTarget1695704530152 implements MigrationInterface {
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
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            tableName,
            new TableIndex({
                name: 'IDX_MESSENGER_TARGET',
                columnNames: ['room_id', 'user_id'],
                isUnique: true,
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(tableName);
        if (table) {
            await queryRunner.dropTable(tableName);
        }
    }
}
