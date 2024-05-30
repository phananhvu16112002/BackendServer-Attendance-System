import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"
import { Classes } from "./Classes"
@Entity()
export class Course {
    @PrimaryColumn()
    courseID: string

    @Column({default: ""})
    courseName: string

    @Column({default: 0})
    credit: number

    @OneToMany(() => Classes, Classes => Classes.course)
    classes: Classes[]
}