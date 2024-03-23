import { Column, Entity, PrimaryColumn } from "typeorm";

Entity()
export class Admin {
    @PrimaryColumn()
    adminEmail: string;

    @Column({default: ""})
    adminHashedPassword: string
}