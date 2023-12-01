import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { AttendanceDetail } from "./AttendanceDetail"
import { type } from "os"
@Entity()
export class Evidence {
    @PrimaryColumn()
    evidenceID: string

    @Column()
    evidenceImage: string

    @ManyToOne(() => AttendanceDetail, AttendanceDetail => AttendanceDetail.student)
    @JoinColumn({name: "studentID", referencedColumnName: "student"})
    student: AttendanceDetail

    @ManyToOne(() => AttendanceDetail, AttendanceDetail => AttendanceDetail.classes)
    @JoinColumn({name: "classID", referencedColumnName: "classes"})
    classes: AttendanceDetail

    @ManyToOne(() => AttendanceDetail, AttendanceDetail => AttendanceDetail.attendanceForm)
    @JoinColumn({name: "formID", referencedColumnName: "attendanceForm"})
    attendanceForm: AttendanceDetail
}