import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

export enum CodeTypeEnum {
    GROUP = 'group',
    CODE = 'code',
}

@Entity()
export class Codes extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: `enum`, nullable: false, enum: CodeTypeEnum })
    type: CodeTypeEnum

    @Column({ type: `varchar`, nullable: false, length: 3 })
    group_id: string

    @Column({ type: `varchar`, nullable: false, length: 6, unique: true })
    code_id: string

    @Column({ type: `varchar`, nullable: false })
    name: string

    @Column({ type: `timestamp`, nullable: false })
    created_at: string
}
