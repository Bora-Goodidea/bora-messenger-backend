import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessengerChatAddTypeColumn1696399923146 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE messenger_chat ADD message_type varchar(6) AFTER chat_code;`);

        await queryRunner.query(`update messenger_chat set message_type = '040010'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE messenger_chat DROP COLUMN message_type`);
    }
}
