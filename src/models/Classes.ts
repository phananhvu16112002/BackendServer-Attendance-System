import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from "typeorm"
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

    @Column({type: "datetime", nullable: true})
    startTime: string

    @Column({type: "datetime", nullable: true})
    endTime: string

    @Column({default: ""})
    classType: string

    @Column({default: ""})
    group: string

    @Column({default: ""})
    subGroup: string

    @ManyToOne(() => Course, Course => Course.classes)
    course: Course

    @ManyToOne(() => Teacher, Teacher => Teacher.classes)
    teacher: Teacher

    @OneToMany(() => StudentClass, StudentClass => StudentClass.classes)
    studentClass: StudentClass[]

    @OneToMany(() => AttendanceForm, AttendanceForm => AttendanceForm.classes)
    attendanceForm: AttendanceForm[]
}