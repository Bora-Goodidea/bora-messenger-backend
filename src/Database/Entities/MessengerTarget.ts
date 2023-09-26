import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { Users } from '@Entity/Users';
import { MessengerMaster } from '@Entity/MessengerMaster';

@Entity()
export class MessengerTarget extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: `int`, nullable: false })
    room_id: number;

    @Column({ type: `int`, nullable: false })
    user_id: number;

    @Column({ type: `timestamp`, nullable: false })
    created_at: Date;

    @OneToOne(() => MessengerMaster, (m) => m.id, { cascade: true })
    @JoinColumn({ name: `room_id` })
    room?: MessengerMaster;

    @OneToOne(() => Users, (User) => User.id, { cascade: true })
    @JoinColumn({ name: `user_id` })
    user?: Users;
}
