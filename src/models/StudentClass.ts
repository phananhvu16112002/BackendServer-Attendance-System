import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Classes } from "./Classes"
import { Student } from "./Student"
import { AttendanceDetail } from "./AttendanceDetail"
@Entity()
export class StudentClass {
    @PrimaryColumn({name: "studentID", type: 'string'})
    @ManyToOne(() => Student, (Student) => Student.studentClass)
    @JoinColumn({name:"studentID",referencedColumnName:"studentID"})
    student: Student

    @PrimaryColumn({name: "classID", type: 'string'})
    @ManyToOne(() => Classes, (Classes) => Classes.studentClass)
    @JoinColumn({name:"classID",referencedColumnName:"classID"})
    classes: Classes

    @Column({default: 0})
    presenceTotal: number

    @Column({default: 0})
    lateTotal: number

    @Column({default: 0})
    absenceTotal: number 

    // @OneToMany(() => AttendanceDetail, AttendanceDetail => AttendanceDetail.studentClass)
    // attendanceDetail: AttendanceDetail[]
}