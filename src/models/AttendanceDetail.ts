import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { AttendanceForm } from "./AttendanceForm"
import { StudentClass } from "./StudentClass"
import {Report} from "./Report";
import { Student } from "./Student"
import { Classes } from "./Classes"

@Entity()
export class AttendanceDetail {

    @PrimaryColumn({name: "studentID", type: "string"})
    studentDetail: string

    @PrimaryColumn({name: "classID", type: "string"})
    classDetail: string

    @ManyToOne(() => StudentClass, StudentClass => StudentClass)
    @JoinColumn([
        {name: "studentID", referencedColumnName: "studentDetail"},
        {name: "classID", referencedColumnName: "classDetail"},
    ])
    studentClass : StudentClass

    @PrimaryColumn({type: "string", name: "formID"})
    @ManyToOne(() => AttendanceForm, (AttendanceForm) => AttendanceForm)
    @JoinColumn({name:"formID", referencedColumnName:"formID"})
    attendanceForm: AttendanceForm

    // @ManyToOne(() => StudentClass, StudentClass => StudentClass)
    // @JoinColumn([
    //     {name: "studentID", referencedColumnName: "studentDetail"},
    //     {name: "classID", referencedColumnName: "classDetail"},
    // ])
    // studentClass: StudentClass

    // @ManyToOne(() => AttendanceForm, (AttendanceForm) => AttendanceForm.attendanceDetails)
    // attendanceForm: AttendanceForm

    // @OneToMany(() => Report, (Report) => Report.attendanceDetail)
    // reports: Report[]

    @Column({default: 0})
    result: number

    @Column({type: "datetime", nullable: true})
    dateAttendanced: string

    @Column({default: ""})
    location: string

    @Column({default: ""})
    note: string

    @Column({type: "double", default: 0, nullable: true})
    latitude: number

    @Column({type: "double", default: 0, nullable: true})
    longitude: number

    @Column({default: ""})
    url: string

    // @Column({type: "datetime", nullable: true})
    // createdAt: string
}