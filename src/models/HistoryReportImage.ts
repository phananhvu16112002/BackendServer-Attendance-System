import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { HistoryReport } from "./HistoryReport"

@Entity()
export class HistoryReportImage {
    @PrimaryGeneratedColumn()
    historyReportImageID: number

    @Column()
    imageURL: string

    @ManyToOne(() => HistoryReport, (historyReport) => historyReport.historyReportImages)
    @JoinColumn({name:"historyReportID", referencedColumnName:"historyReportID"})
    historyReport: HistoryReport
}