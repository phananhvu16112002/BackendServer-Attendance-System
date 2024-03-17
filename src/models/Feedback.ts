import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
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

    @Column({type: "datetime", nullable: true})
    createdAt: string

    @OneToOne(() => Report, (report) => report.feedback)
    @JoinColumn({name:"reportID", referencedColumnName:"reportID"})
    report: Report
}