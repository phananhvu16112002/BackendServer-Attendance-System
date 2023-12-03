import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"
import { Classes } from "./Classes"
@Entity()
export class Teacher {
    @PrimaryColumn()
    teacherID: string

    @Column({default: ""})
    teacherName: string

    @Column({default: ""})
    teacherHashedPassword: string

    @Column({default: ""})
    teacherEmail: string

    @Column({default: ""})
    hashedOTP: string

    @Column({default: ""})
    accessToken: string

    @Column({default: ""})
    refreshToken: string

    @Column({default: ""})
    resetToken: string

    @Column({type: "datetime", nullable: true})
    timeToLiveOTP: string

    @Column({default: false})
    active: boolean

    @OneToMany(() => Classes, Classes => Classes.teacher)
    classes: Classes[]
}