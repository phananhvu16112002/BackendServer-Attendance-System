import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { AttendanceForm } from "./AttendanceForm"
import { StudentClass } from "./StudentClass"
import {Report} from "./Report";

import { Student } from "./Student"
import { Classes } from "./Classes"
import { Evidence } from "./Evidence"
@Entity()
export class AttendanceDetail {
    // @PrimaryColumn({type: "string", name: "studentID"})
    // @ManyToOne(() => Student, (Student) => Student.studentID)
    // @JoinColumn({name: "studentID", referencedColumnName: "studentID"})
    // student: Student

    // @PrimaryColumn({type: "string", name: "classID"})
    // @ManyToOne(() => Classes, (Classes) => Classes.classID)
    // @JoinColumn({name: "classID", referencedColumnName: "classID"})
    // classes: Classes

    //////Oke
    @PrimaryColumn({type: "string", name: "studentID"})
    @ManyToOne(() => StudentClass, (StudentClass) => StudentClass.studentID)
    @JoinColumn({name: "studentID", referencedColumnName: "studentID"})
    studentDetail: StudentClass

    @PrimaryColumn({type: "string", name: "classID"})
    @ManyToOne(() => StudentClass, (StudentClass) => StudentClass.classID)
    @JoinColumn({name: "classID", referencedColumnName: "classID"})
    classDetail: StudentClass

    @PrimaryColumn({type: "string", name: "formID"})
    @ManyToOne(() => AttendanceForm, (AttendanceForm) => AttendanceForm.formID)
    @JoinColumn({name:"formID", referencedColumnName:"formID"})
    attendanceForm: AttendanceForm
    ///////

    @Column({default: 0})
    result: number

    @Column({type: "datetime", nullable: true})
    dateAttendanced: string

    @Column({default: ""})
    location: string

    @Column({default: ""})
    note: string

    @Column({type: "decimal", precision: 10, scale: 2, default: 0, nullable: true})
    latitude: number

    @Column({type: "decimal", precision: 10, scale: 2, default: 0, nullable: true})
    longitude: number

    @Column({default: ""})
    url: string

    // @OneToMany(() => Report, Report => Report.attendanceDetail)
    // report: Report[]
}