import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { AttendanceDetail } from "./AttendanceDetail"
import { ReportImage } from "./ReportImage"
import { Feedback } from "./Feedback"

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    reportID: number

    @Column()
    message: string

    @Column()
    status: string

    @ManyToOne(() => AttendanceDetail, AttendanceDetail => AttendanceDetail)
    @JoinColumn([
        {name: "studentID", referencedColumnName: "studentDetail"},
        {name: "classID", referencedColumnName: "classDetail"},
        {name: "formID", referencedColumnName: "attendanceForm"},
    ])
    attendanceDetail: AttendanceDetail

    @OneToMany(() => ReportImage, ReportImage => ReportImage.report)
    reportImage: ReportImage[]

    @OneToMany(() => Feedback, (feedback) => feedback.report)
    feedbacks: Feedback[]
}