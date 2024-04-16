import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { HistoryReport } from "./HistoryReport"

@Entity()
export class HistoryFeedback {
    @PrimaryGeneratedColumn()
    historyFeedbackID: number

    @Column()
    topic: string 

    @Column()
    message: string

    @Column()
    confirmStatus: string

    @Column({type: "datetime", nullable: true})
    createdAt: string

    @OneToOne(() => HistoryReport, (historyReport) => historyReport.historyFeedbacks, {onDelete: 'CASCADE'})
    @JoinColumn({name:"historyReportID", referencedColumnName:"historyReportID"})
    historyReport: HistoryReport
}