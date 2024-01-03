import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"
import {Report} from "./Report";

@Entity()
export class ReportImage {
    @PrimaryGeneratedColumn()
    imageID: number

    @Column()
    imageURL: string

    @Column()
    imageHash: string

    @ManyToOne(() => Report, Report => Report.reportImage)
    @JoinColumn({name:"reportID", referencedColumnName:"reportID"})
    report: Report
}