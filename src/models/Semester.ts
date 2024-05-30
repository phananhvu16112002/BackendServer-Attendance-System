import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Classes } from "./Classes"

@Entity()
export class Semester {
    @PrimaryGeneratedColumn()
    semesterID: number

    @Column({default: ""})
    semesterName: string

    @Column()
    semesterDescription: string

    @Column({type: "datetime"})
    startDate: string

    @Column({type: "datetime"})
    endDate: string

    @OneToMany(() => Classes, Classes => Classes.course)
    classes: Classes[]
}