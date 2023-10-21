import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { Users } from '@Entity/Users';
import { StatusTypeEnum } from '@Types/CommonTypes';

@Entity()
export class PasswordReset extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: `int`, nullable: false })
    user_id: number;

    @Column({ type: `varchar`, nullable: false, length: 255, unique: true })
    reset_code: string;

    @Column({ type: `enum`, nullable: false, enum: StatusTypeEnum })
    status: string;

    @Column({ type: `timestamp`, nullable: true })
    completed_at: string;

    @Column({ type: `timestamp`, nullable: false })
    created_at: Date;

    @OneToOne(() => Users, (User) => User.id, { cascade: true })
    @JoinColumn({ name: `user_id` })
    user?: Users;
}
