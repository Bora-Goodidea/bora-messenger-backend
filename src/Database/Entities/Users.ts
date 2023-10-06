import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { Codes } from './Codes';
import { EmailAuth } from './EmailAuth';
import { Profile } from './Profile';
import { UserActive } from './UserActive';

@Entity()
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: `varchar`, nullable: false, length: 40 })
    uid: string;

    @Column({ type: `char`, nullable: false, length: 6 })
    type: string;

    @Column({ type: `char`, nullable: false, length: 6 })
    level: string;

    @Column({ type: `char`, nullable: false, length: 6 })
    status: string;

    @Column({ type: `varchar`, nullable: false, length: 255, unique: true })
    email: string;

    @Column({ type: `varchar`, nullable: false, length: 255 })
    password: string;

    @Column({ type: `varchar`, nullable: false, length: 255, unique: true })
    nickname: string;

    @Column({ type: `timestamp`, nullable: true })
    email_verified_at: string;

    @Column({ type: `timestamp`, nullable: false })
    updated_at: string;

    @Column({ type: `timestamp`, nullable: false })
    created_at: string;

    @OneToOne(() => Codes, (Code) => Code.code_id, { cascade: true })
    @JoinColumn({ name: `type`, referencedColumnName: `code_id` })
    typeCode?: Codes;

    @OneToOne(() => Codes, (Code) => Code.code_id, { cascade: true })
    @JoinColumn({ name: `level`, referencedColumnName: `code_id` })
    levelCode?: Codes;

    @OneToOne(() => Codes, (Code) => Code.code_id, { cascade: true })
    @JoinColumn({ name: `status`, referencedColumnName: `code_id` })
    statusCode?: Codes;

    @OneToOne(() => EmailAuth, (EA) => EA.user_id, { cascade: true })
    @JoinColumn({ name: `id`, referencedColumnName: `user_id` })
    emailauth?: EmailAuth;

    @OneToOne(() => Profile, (p) => p.user_id, { cascade: true })
    @JoinColumn({ name: `id` })
    profile?: Profile;

    @OneToOne(() => UserActive, (a) => a.user_id, { cascade: true })
    @JoinColumn({ name: `id`, referencedColumnName: `user_id` })
    active?: UserActive;
}
