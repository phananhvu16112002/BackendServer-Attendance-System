import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { HistoryFeedback } from "./HistoryFeedback"
import { HistoryReportImage } from "./HistoryReportImage"
import { Report } from "./Report"

@Entity()
export class HistoryReport {
    @PrimaryGeneratedColumn()
    historyReportID: number

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

    @OneToOne(() => HistoryFeedback, (feedback) => feedback.historyReport, {cascade: true})
    historyFeedbacks: HistoryFeedback

    @OneToMany(() => HistoryReportImage, ReportImage => ReportImage.historyReport, {cascade: true})
    historyReportImages: HistoryReportImage[]

    @ManyToOne(() => Report, (Report) => Report.historyReports)
    @JoinColumn({name:"reportID", referencedColumnName:"reportID"})
    report: Report
}