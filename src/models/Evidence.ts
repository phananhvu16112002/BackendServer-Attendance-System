import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { AttendanceDetail } from "./AttendanceDetail"

@Entity()
export class Evidence {
    @PrimaryColumn()
    evidenceID: string

    @Column()
    evidenceImage: string

    @ManyToOne(() => AttendanceDetail, AttendanceDetail => AttendanceDetail.studentDetail)
    @JoinColumn({name: "studentID", referencedColumnName: "studentDetail"})
    student: AttendanceDetail

    @ManyToOne(() => AttendanceDetail, AttendanceDetail => AttendanceDetail.classDetail)
    @JoinColumn({name: "classID", referencedColumnName: "classes"})
    classes: AttendanceDetail

    @ManyToOne(() => AttendanceDetail, AttendanceDetail => AttendanceDetail.attendanceForm)
    @JoinColumn({name: "formID", referencedColumnName: "attendanceForm"})
    attendanceForm: AttendanceDetail
}