import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { AttendanceForm } from "./AttendanceForm"
import { StudentClass } from "./StudentClass"
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

    @PrimaryColumn({type: "string", name: "studentID"})
    @ManyToOne(() => StudentClass, (StudentClass) => StudentClass.student)
    @JoinColumn({name: "studentID", referencedColumnName: "student"})
    student: StudentClass

    @PrimaryColumn({type: "string", name: "classID"})
    @ManyToOne(() => StudentClass, (StudentClass) => StudentClass.classes)
    @JoinColumn({name: "classID", referencedColumnName: "classes"})
    classes: StudentClass

    @PrimaryColumn({type: "string", name: "formID"})
    @ManyToOne(() => AttendanceForm, (AttendanceForm) => AttendanceForm.formID)
    @JoinColumn({name:"formID",referencedColumnName:"formID"})
    attendanceForm: AttendanceForm

    @Column()
    present: boolean

    @Column()
    late: boolean

    @Column()
    absence: boolean

    @Column({type: "datetime", nullable: true})
    date: string

    @Column()
    location: string

    @Column()
    note: string

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    latitude: number

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    longitude: number

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    altitude: number

    // @OneToMany(() => Evidence, Evidence => Evidence)
    // evidences: Evidence[]
}