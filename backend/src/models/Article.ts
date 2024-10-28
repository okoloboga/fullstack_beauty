import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    content!: string;

    @Column({ nullable: true })
    coverImage!: string;

    @ManyToOne(() => User, (user) => user.id)
    author!: User;
}
