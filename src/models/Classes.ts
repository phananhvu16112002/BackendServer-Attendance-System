import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { Course } from "./Course"
import { Teacher } from "./Teacher"
import { StudentClass } from "./StudentClass"
import { AttendanceForm } from "./AttendanceForm"
import { Semester } from "./Semester"
@Entity()
export class Classes {
    @PrimaryColumn()
    classID: string
    
    @ManyToOne(() => Course, Course => Course.classes, {onDelete: "CASCADE"})
    @JoinColumn({name:"courseID", referencedColumnName:"courseID"})
    course: Course

    @ManyToOne(() => Semester, Semester => Semester.classes)
    @JoinColumn({name:"semesterID", referencedColumnName:"semesterID"})
    semester: Semester

    @Column()
    group: string

    @Column()
    subGroup: string

    @Column({type: "datetime", nullable: true})
    startDate: string

    @Column({type: "datetime", nullable: true})
    endDate: string

    @Column({default: ""})
    classType: string

    @Column({default: false})
    isArchived: boolean

    @ManyToOne(() => Teacher, Teacher => Teacher.classes, {onDelete: "CASCADE"})
    @JoinColumn({name:"teacherID", referencedColumnName:"teacherID"})
    teacher: Teacher

    @OneToMany(() => StudentClass, StudentClass => StudentClass.classDetail)
    studentClass: StudentClass[]

    @OneToMany(() => AttendanceForm, AttendanceForm => AttendanceForm.classes)
    attendanceForm: AttendanceForm[]
}