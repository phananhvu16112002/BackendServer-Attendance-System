import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Student } from "./Student";

@Entity()
export class StudentDeviceToken {
    @PrimaryColumn()
    token: string;

    @ManyToOne(() => Student, Student => Student.studentDeviceTokens, {onDelete: "CASCADE"})
    @JoinColumn({name:"studentID", referencedColumnName:"studentID"})
    studentID: Student
}