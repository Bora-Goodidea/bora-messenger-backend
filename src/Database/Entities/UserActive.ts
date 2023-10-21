import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { Users } from '@Entity/Users';
import { StatusTypeEnum } from '@Types/CommonTypes';

@Entity()
export class UserActive extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: `int`, nullable: false })
    user_id: number;

    @Column({ type: `varchar`, nullable: false, length: 50, unique: true })
    sid: string;

    @Column({ type: `enum`, nullable: false, enum: StatusTypeEnum })
    active: string;

    @Column({ type: `timestamp`, nullable: false })
    updated_at: string;

    @Column({ type: `timestamp`, nullable: false })
    created_at: string;

    @OneToOne(() => Users, (User) => User.id, { cascade: true })
    @JoinColumn({ name: `user_id` })
    user?: Users;
}
