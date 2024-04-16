import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"
import {Report} from "./Report";

@Entity()
export class ReportImage {
    @PrimaryColumn()
    imageID: string

    @Column()
    imageURL: string

    @ManyToOne(() => Report, Report => Report.reportImage, {onDelete: 'CASCADE'})
    @JoinColumn({name:"reportID", referencedColumnName:"reportID"})
    report: Report
}
