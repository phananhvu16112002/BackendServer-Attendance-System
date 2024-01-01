import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import {Report} from "./Report";

@Entity()
export class ReportImage {
    @PrimaryGeneratedColumn()
    imageID: number

    @Column()
    imageURL: string

    @ManyToOne(() => Report, Report => Report.reportImage)
    report: Report
}