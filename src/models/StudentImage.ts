import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"
import { Student } from "./Student"

@Entity()
export class StudentImage {
    @PrimaryGeneratedColumn()
    imageID: number

    @Column()
    imageHash: string

    @Column()
    imageURL: string

    @ManyToOne(() => Student, Student => Student.studentImage)
    @JoinColumn({name:"studentID", referencedColumnName:"studentID"})
    studentID: Student
}