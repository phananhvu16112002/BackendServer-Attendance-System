import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { AttendanceDetail } from "./AttendanceDetail"

@Entity()
export class EditionHistory {
    @PrimaryGeneratedColumn()
    editionHistoryID: number

    @Column()
    topic: string 

    @Column()
    message: string

    @Column()
    confirmStatus: string

    @Column({type: "datetime", nullable: true})
    createdAt: string

    @ManyToOne(() => AttendanceDetail, AttendanceDetail => AttendanceDetail)
    @JoinColumn([
        {name: "studentID", referencedColumnName: "studentDetail"},
        {name: "classID", referencedColumnName: "classDetail"},
        {name: "formID", referencedColumnName: "attendanceForm"},
    ])
    attendanceDetail: AttendanceDetail
}