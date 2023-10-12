import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessengerChatRemoveCheckedColumn1697076352891 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE messenger_chat DROP COLUMN checked;`);
        await queryRunner.query(`ALTER TABLE messenger_chat DROP COLUMN checked_at;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE messenger_chat ADD checked ENUM('Y','N') DEFAULT 'N' AFTER message;`);
        await queryRunner.query(`ALTER TABLE messenger_chat ADD checked_at datetime DEFAULT NULL AFTER checked;`);

        await queryRunner.query(`update messenger_chat set checked = 'Y'`);
        await queryRunner.query(`update messenger_chat set checked_at = now()`);
    }
}
