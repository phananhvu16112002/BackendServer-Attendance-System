import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Classes } from "./Classes"
import { Teacher } from "./Teacher"
import { AttendanceDetail } from "./AttendanceDetail"
@Entity()
export class AttendanceForm {
    @PrimaryColumn()
    formID: string

    @ManyToOne(() => Classes, (Classes) => Classes.attendanceForm, {onDelete: "CASCADE"})
    @JoinColumn({name:"classID",referencedColumnName:"classID"})
    classes: Classes

    @Column({default: ""})
    roomNumber: string

    @Column({default: 0})
    shiftNumber: number

    @Column({type: "time"})
    periodStartTime: string

    @Column({type: "time"})
    periodEndTime: string

    @Column({type: "datetime"})
    periodDateTime: string

    @Column({default: false})
    status: boolean

    @Column({type: "datetime", nullable: true})
    dateOpen: string

    @Column({type: "datetime", nullable: true})
    startTime: string

    @Column({type: "datetime", nullable: true})
    endTime: string

    @Column({default: 0})
    type: number

    @Column({type: "double", default: 0, nullable: true})
    latitude: number

    @Column({type: "double", default: 0, nullable: true})
    longitude: number

    @Column({default: 0})
    radius: number

    // @OneToMany(() => AttendanceDetail, (AttendanceDetail) => AttendanceDetail.attendanceForm)
    // attendanceDetails: AttendanceDetail[]
}