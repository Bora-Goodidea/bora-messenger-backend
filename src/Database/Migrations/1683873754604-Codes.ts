import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class Codes1683873754604 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'codes',
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
                        type: 'enum',
                        enum: ['group', 'code'],
                        isNullable: false,
                    },
                    {
                        name: 'group_id',
                        type: 'char',
                        length: '3',
                        isNullable: false,
                        isUnique: false,
                    },
                    {
                        name: 'code_id',
                        type: 'char',
                        length: '6',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
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

        await queryRunner.createIndex(
            'codes',
            new TableIndex({
                name: 'IDX_CODES_CODE_ID',
                columnNames: ['code_id'],
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('codes')
        if (table) {
            await queryRunner.dropTable('codes')
        }
    }
}
