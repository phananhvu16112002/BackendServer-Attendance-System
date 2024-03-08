import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { Course } from "./Course"
import { Teacher } from "./Teacher"
import { StudentClass } from "./StudentClass"
import { AttendanceForm } from "./AttendanceForm"
@Entity()
export class Classes {
    @PrimaryColumn()
    classID: string

    @Column({default: ""})
    roomNumber: string

    @Column({default: 0})
    shiftNumber: number

    @Column({type: "time", nullable: false})
    startTime: string

    @Column({type: "time", nullable: false})
    endTime: string

    @Column({default: ""})
    classType: string

    @Column({default: ""})
    group: string

    @Column({default: ""})
    subGroup: string

    @ManyToOne(() => Course, Course => Course.classes)
    @JoinColumn({name:"courseID", referencedColumnName:"courseID"})
    course: Course

    @ManyToOne(() => Teacher, Teacher => Teacher.classes)
    @JoinColumn({name:"teacherID", referencedColumnName:"teacherID"})
    teacher: Teacher

    @OneToMany(() => StudentClass, StudentClass => StudentClass.classDetail)
    studentClass: StudentClass[]

    @OneToMany(() => AttendanceForm, AttendanceForm => AttendanceForm.classes)
    attendanceForm: AttendanceForm[]
}