import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm"
import { AttendanceDetail } from "./AttendanceDetail"
import { ReportImage } from "./ReportImage"
import { Feedback } from "./Feedback"
import { HistoryReport } from "./HistoryReport"

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    reportID: number

    @Column()
    topic: string

    @Column()
    problem: string

    @Column()
    message: string

    @Column()
    status: string

    @Column({type: "datetime", nullable: true})
    createdAt: string

    @Column()
    new: boolean

    @Column()
    important: boolean

    @OneToOne(() => AttendanceDetail, AttendanceDetail => AttendanceDetail)
    @JoinColumn([
        {name: "studentID", referencedColumnName: "studentDetail"},
        {name: "classID", referencedColumnName: "classDetail"},
        {name: "formID", referencedColumnName: "attendanceForm"},
    ])
    attendanceDetail: AttendanceDetail

    @OneToMany(() => ReportImage, ReportImage => ReportImage.report)
    reportImage: ReportImage[]

    @OneToOne(() => Feedback, (feedback) => feedback.report)
    feedback: Feedback

    @OneToMany(() => HistoryReport, (HistoryReport) => HistoryReport.report)
    historyReports: HistoryReport[]
}