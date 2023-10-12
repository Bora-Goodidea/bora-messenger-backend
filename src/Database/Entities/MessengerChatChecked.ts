import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { MessengerChat } from '@Entity/MessengerChat';
import { Users } from '@Entity/Users';

@Entity()
export class MessengerChatChecked extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: `int`, nullable: false })
    chat_id: number;

    @Column({ type: `int`, nullable: false })
    user_id: number;

    @Column({ type: `timestamp`, nullable: false })
    created_at: string;

    @OneToOne(() => MessengerChat, (mc) => mc.id, { cascade: true })
    @JoinColumn({ name: `chat_id` })
    chat?: MessengerChat;

    @OneToOne(() => Users, (User) => User.id, { cascade: true })
    @JoinColumn({ name: `user_id` })
    user?: Users;
}
