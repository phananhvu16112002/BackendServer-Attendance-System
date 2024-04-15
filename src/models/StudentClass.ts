import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Classes } from "./Classes"
import { Student } from "./Student"
import { AttendanceDetail } from "./AttendanceDetail"

@Entity()
export class StudentClass {
    @PrimaryColumn({name: "studentID", type: 'string'})
    @ManyToOne(() => Student, (Student) => Student.studentClass, {onDelete: "CASCADE"})
    @JoinColumn({name:"studentID", referencedColumnName:"studentID"})
    studentDetail: Student

    @PrimaryColumn({name: "classID", type: 'string'})
    @ManyToOne(() => Classes, (Classes) => Classes.studentClass, {onDelete: "CASCADE"})
    @JoinColumn({name:"classID", referencedColumnName:"classID"})
    classDetail: Classes

    // @OneToMany(() => AttendanceDetail, (AttendanceDetail) => AttendanceDetail)
    // attendanceDetails: AttendanceDetail[]
}