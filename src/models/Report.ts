import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { AttendanceDetail } from "./AttendanceDetail"
import { ReportImage } from "./ReportImage"

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    reportID: number

    @Column()
    message: string

    // @ManyToOne(() => AttendanceDetail, AttendanceDetail => AttendanceDetail.report)
    // attendanceDetail: AttendanceDetail

    @OneToMany(() => ReportImage, ReportImage => ReportImage.report)
    reportImage: ReportImage[]
}