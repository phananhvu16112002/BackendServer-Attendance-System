import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { Student } from "./Student"

@Entity()
export class StudentImage {
    @PrimaryGeneratedColumn()
    imageID: number

    @Column()
    descriptor: string

    @Column()
    imageURL: string

    @ManyToOne(() => Student, Student => Student.studentImage)
    studentID: Student
}