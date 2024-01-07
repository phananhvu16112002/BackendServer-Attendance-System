import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { Classes } from "./Classes"
import { Teacher } from "./Teacher"

@Entity()
export class AttendanceForm {
    @PrimaryColumn()
    formID: string

    @ManyToOne(() => Classes, (Classes) => Classes.attendanceForm)
    @JoinColumn({name:"classID",referencedColumnName:"classID"})
    classes: Classes

    @Column({type: "datetime", nullable: true})
    startTime: string

    @Column({type: "datetime", nullable: true})
    endTime: string

    @Column()
    status: boolean

    @Column({type: "datetime", nullable: true})
    dateOpen: string

    @Column({default: 0})
    type: number
}