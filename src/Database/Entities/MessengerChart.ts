import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { Users } from '@Entity/Users';
import { MessengerMaster } from '@Entity/MessengerMaster';

export enum StatusTypeEnum {
    TRUE = 'Y',
    FALSE = 'N',
}

@Entity()
export class MessengerChart extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: `int`, nullable: false })
    room_id: number;

    @Column({ type: `int`, nullable: false })
    user_id: number;

    @Column({ type: `int`, nullable: false })
    target_id: number;

    @Column({ type: `varchar`, nullable: false, length: 255, unique: true })
    chart_code: string;

    @Column({ type: `text`, nullable: false })
    message: string;

    @Column({ type: `enum`, nullable: false, enum: StatusTypeEnum })
    checked: string;

    @Column({ type: `timestamp`, nullable: false })
    checked_at: Date;

    @Column({ type: `timestamp`, nullable: false })
    created_at: Date;

    @OneToOne(() => MessengerMaster, (m) => m.id, { cascade: true })
    @JoinColumn({ name: `room_id` })
    room?: MessengerMaster;

    @OneToOne(() => Users, (User) => User.id, { cascade: true })
    @JoinColumn({ name: `user_id` })
    user?: Users;

    @OneToOne(() => Users, (User) => User.id, { cascade: true })
    @JoinColumn({ name: `target_id` })
    target?: Users;
}
