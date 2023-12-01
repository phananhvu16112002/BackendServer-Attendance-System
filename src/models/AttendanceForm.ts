import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { Classes } from "./Classes"
import { Teacher } from "./Teacher"

@Entity()
export class AttendanceForm {
    @PrimaryColumn()
    formID: string

    @ManyToOne(() => Classes, (Classes) => Classes.classID)
    @JoinColumn({name:"classID",referencedColumnName:"classID"})
    classes: Classes

    @ManyToOne(() => Teacher, (Teacher) => Teacher.teacherID)
    @JoinColumn({name:"teacherID",referencedColumnName:"teacherID"})
    teacher: Teacher

    @Column({type: "datetime", nullable: true})
    startTime: string

    @Column({type: "datetime", nullable: true})
    endTime: string

    @Column()
    status: boolean

    @Column({type: "datetime", nullable: true})
    date: string

    @Column()
    weekNumber: number
}