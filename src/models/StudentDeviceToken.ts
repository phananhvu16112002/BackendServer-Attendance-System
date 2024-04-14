import { JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Student } from "./Student";

export class StudentDeviceToken {
    @PrimaryColumn()
    token: string;

    @ManyToOne(() => Student, Student => Student.studentDeviceTokens)
    @JoinColumn({name:"studentID", referencedColumnName:"studentID"})
    studentID: Student
}