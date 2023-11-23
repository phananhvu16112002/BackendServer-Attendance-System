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

    @Column({default: false})
    active: boolean
}