import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { Classes } from "./Classes"
import { Student } from "./Student"

@Entity()
export class StudentClass {
    @PrimaryColumn({name: "studentID", type: 'string'})
    @ManyToOne(() => Student, (Student) => Student.studentID)
    @JoinColumn({name:"studentID",referencedColumnName:"studentID"})
    student: Student

    @PrimaryColumn({name: "classID", type: 'string'})
    @ManyToOne(() => Classes, (Classes) => Classes.classID)
    @JoinColumn({name:"classID",referencedColumnName:"classID"})
    classes: Classes

    @Column()
    presenceTotal: number

    @Column()
    lateTotal: number

    @Column()
    absenceTotal: number 
}