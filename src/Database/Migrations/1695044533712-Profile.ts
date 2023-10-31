import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Profile1695044533712 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'profile',
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
                        isNullable: false,
                    },
                    {
                        name: 'profile_image_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );
        await queryRunner.createForeignKey(
            'profile',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET DEFAULT',
                onUpdate: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'profile',
            new TableForeignKey({
                columnNames: ['profile_image_id'],
                referencedTableName: 'media',
                referencedColumnNames: ['id'],
                // onDelete: 'SET DEFAULT',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('profile');
        if (table) {
            await queryRunner.dropTable('profile');
        }
    }
}
