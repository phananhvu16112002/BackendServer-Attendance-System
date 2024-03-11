import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Report } from "./Report"

@Entity()
export class Feedback {
    @PrimaryGeneratedColumn()
    feedbackID: number

    @Column()
    topic: string 

    @Column()
    message: string

    @Column()
    confirmStatus: string

    @ManyToOne(() => Report, (report) => report.feedbacks)
    report: Report
}