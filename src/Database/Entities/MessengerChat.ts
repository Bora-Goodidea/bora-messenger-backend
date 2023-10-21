import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Users } from '@Entity/Users';
import { MessengerMaster } from '@Entity/MessengerMaster';
import { Codes } from '@Entity/Codes';
import { MessengerChatChecked } from '@Entity/MessengerChatChecked';

@Entity()
export class MessengerChat extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: `int`, nullable: false })
    room_id: number;

    @Column({ type: `int`, nullable: false })
    user_id: number;

    @Column({ type: `int`, nullable: false })
    target_id: number;

    @Column({ type: `varchar`, nullable: false, length: 255, unique: true })
    chat_code: string;

    @Column({ type: `char`, nullable: false, length: 6 })
    message_type: string;

    @Column({ type: `text`, nullable: false })
    message: string;

    @Column({ type: `timestamp`, nullable: false })
    created_at: string;

    @OneToOne(() => MessengerMaster, (m) => m.id, { cascade: true })
    @JoinColumn({ name: `room_id` })
    room?: MessengerMaster;

    @OneToOne(() => Users, (User) => User.id, { cascade: true })
    @JoinColumn({ name: `user_id` })
    user?: Users;

    @OneToOne(() => Users, (User) => User.id, { cascade: true })
    @JoinColumn({ name: `target_id` })
    target?: Users;

    @OneToOne(() => Codes, (Code) => Code.code_id, { cascade: true })
    @JoinColumn({ name: `message_type`, referencedColumnName: `code_id` })
    messageType?: Codes;

    @OneToMany(() => MessengerChatChecked, (mt) => mt.chat)
    checked?: MessengerChatChecked[];
}
