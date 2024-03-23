import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Employee {
    @PrimaryColumn()
    employeeEmail: string;

    @Column()
    employeeHashedPassword: string;
}