import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Student {
    @PrimaryColumn()
    studentID: string

    @Column({default: ""})
    studentName: string

    @Column({default: ""})
    studentHashedPassword: string

    @Column({default: ""})
    studentEmail: string

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
}