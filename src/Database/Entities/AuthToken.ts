import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { Users } from '@Entity/Users';

export enum StatusTypeEnum {
    TRUE = 'Y',
    FALSE = 'N',
}

@Entity()
export class AuthToken extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: `int`, nullable: false })
    user_id: number;

    @Column({ type: `varchar`, nullable: false, length: 255, unique: true })
    token: string;

    @Column({ type: `enum`, nullable: false, enum: StatusTypeEnum })
    status: string;

    @Column({ type: `timestamp`, nullable: true })
    verified_at: string;

    @Column({ type: `timestamp`, nullable: false })
    created_at: Date;

    @OneToOne(() => Users, (User) => User.id, { cascade: true })
    @JoinColumn({ name: `user_id` })
    user?: Users;
}
