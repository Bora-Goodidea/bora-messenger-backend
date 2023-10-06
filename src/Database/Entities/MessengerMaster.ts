import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Users } from '@Entity/Users';
import { MessengerTarget } from '@Entity/MessengerTarget';
import { MessengerChat } from '@Entity/MessengerChat';

@Entity()
export class MessengerMaster extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: `int`, nullable: false })
    user_id: number;

    @Column({ type: `varchar`, nullable: false, length: 255, unique: true })
    room_code: string;

    @Column({ type: `varchar`, nullable: false, length: 255, unique: true })
    gubun_code: string;

    @Column({ type: `timestamp`, nullable: false })
    updated_at: string;

    @Column({ type: `timestamp`, nullable: false })
    created_at: string;

    @OneToOne(() => Users, (User) => User.id, { cascade: true })
    @JoinColumn({ name: `user_id` })
    user?: Users;

    @OneToMany(() => MessengerTarget, (mt) => mt.rooms)
    targets?: MessengerTarget[];

    @OneToMany(() => MessengerChat, (mt) => mt.room)
    chat?: MessengerChat[];
}
