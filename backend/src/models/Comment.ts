import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Article } from "./Article";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    content!: string;

    @ManyToOne(() => User, (user) => user.id)
    author!: User;

    @ManyToOne(() => Article, (article) => article.id)
    article!: Article;
}
