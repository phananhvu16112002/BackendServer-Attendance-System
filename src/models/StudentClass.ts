import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Classes } from "./Classes"
import { Student } from "./Student"

@Entity()
export class StudentClass {
    @PrimaryColumn({name: "studentID", type: 'string'})
    @ManyToOne(() => Student, (Student) => Student.studentClass)
    @JoinColumn({name:"studentID", referencedColumnName:"studentID"})
    studentDetail: Student

    @PrimaryColumn({name: "classID", type: 'string'})
    @ManyToOne(() => Classes, (Classes) => Classes.studentClass)
    @JoinColumn({name:"classID", referencedColumnName:"classID"})
    classDetail: Classes

    // @OneToMany(() => AttendanceDetail, (AttendanceDetail) => AttendanceDetail.studentClass)
    // attendanceDetail: AttendanceDetail[]
}